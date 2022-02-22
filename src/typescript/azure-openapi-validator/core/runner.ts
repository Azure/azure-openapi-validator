import { Message } from "./types"
import { DocumentDependencyGraph } from "./depsGraph"
import { nodes } from "./jsonpath"
import { IRuleLoader } from "./ruleLoader"
import { MergeStates, OpenApiTypes, ValidationMessage } from "./types"
import { IRule, IRuleSet } from "./types"
import { IFormatter } from "./formatter"
import { LintOptions } from "."
import { OpenapiDocument } from "./document"
import { SwaggerUtils } from "./swaggerUtils"

const isLegacyRule = (rule: IRule) => {
  return rule.then.execute.length > 2
}

export class LintRunner<T> {
  constructor(private loader: IRuleLoader, private graph: DocumentDependencyGraph, private formatter: IFormatter<T>) {}

  runRules = async (
    document: string,
    openapiDefinition: any,
    sendMessage: (m: Message) => void,
    openapiType: OpenApiTypes,
    ruleset: IRuleSet,
    mergeState?: MergeStates,
    graph?: DocumentDependencyGraph
  ) => {
    const rulesToRun = Object.entries(ruleset.rules).filter(rule => rule[1].openapiType & openapiType)
    const swaggerUtils = new SwaggerUtils(openapiDefinition, document, graph)
    let resolvedSwagger
    if (rulesToRun.some(rule => rule[1].resolved)) {
      resolvedSwagger = await swaggerUtils.resolveSchema(openapiDefinition)
    }
    for (const [ruleName, rule] of rulesToRun) {
      let givens = rule.given || "$"
      if (!Array.isArray(givens)) {
        givens = [givens]
      }
      let targetDefinition = rule.resolved ? resolvedSwagger : openapiDefinition
      for (const given of givens) {
        for (const section of nodes(targetDefinition, given)) {
          const fieldSelector = rule.then.fieldSelector
          if (fieldSelector) {
            for (const subSection of nodes(section.value, fieldSelector)) {
              const location = section.path.slice(1).concat(subSection.path.slice(1))
              const args = isLegacyRule(rule)
                ? [targetDefinition, section.value, location, { specPath: document, graph, utils: swaggerUtils }]
                : [
                    section.value,

                    {
                      document: targetDefinition,
                      location,
                      specPath: document,
                      graph,
                      utils: swaggerUtils,
                      options: rule.then.options
                    }
                  ]
              for await (const message of (rule.then.execute as any)(...args)) {
                emitResult(ruleName, rule, message)
              }
            }
          } else {
            const location = section.path.slice(1)
            const args = isLegacyRule(rule)
              ? [targetDefinition, section.value, location, { specPath: document, graph, utils: swaggerUtils }]
              : [
                  section.value,
                  {
                    document: targetDefinition,
                    location,
                    specPath: document,
                    graph,
                    utils: swaggerUtils,
                    options: rule.then.options
                  }
                ]
            for await (const message of (rule.then.execute as any)(...args)) {
              emitResult(ruleName, rule, message)
            }
          }
        }
      }
    }

    function emitResult(ruleName: string, rule: IRule, message: ValidationMessage) {
      const readableCategory = rule.category

      // try to extract provider namespace and resource type
      const path = message.location[1] === "paths" && message.location[2]
      const pathComponents = typeof path === "string" && path.split("/")
      const pathComponentsProviderIndex = pathComponents && pathComponents.indexOf("providers")
      const pathComponentsTail =
        pathComponentsProviderIndex && pathComponentsProviderIndex >= 0 && pathComponents.slice(pathComponentsProviderIndex + 1)
      const pathComponentProviderNamespace = pathComponentsTail && pathComponentsTail[0]
      const pathComponentResourceType = pathComponentsTail && pathComponentsTail[1]

      sendMessage({
        Channel: rule.severity,
        Text: message.message,
        Key: [ruleName, rule.id, readableCategory],
        Source: [
          {
            document,
            Position: { path: message.location }
          }
        ],
        Details: {
          type: rule.severity,
          code: ruleName,
          message: message.message,
          id: rule.id,
          validationCategory: readableCategory,
          providerNamespace: pathComponentProviderNamespace,
          resourceType: pathComponentResourceType
        }
      })
    }
  }

  output(msgs: string[]) {
    msgs.forEach(m => {
      console.log(m)
    })
  }

  async execute(swaggerPaths: string[], options: LintOptions) {
    const specsPromises = []
    for (const spec of swaggerPaths) {
      specsPromises.push(this.graph.loadDocument(spec))
    }
    const documents = (await Promise.all(specsPromises)) as OpenapiDocument[]
    const msgs = []
    const sendMessage = (msg: Message) => {
      msgs.push(msg)
    }
    const runPromises = []
    for (const doc of documents) {
      const promise = this.runRules(
        doc.getDocumentPath(),
        doc.getObj(),
        sendMessage,
        options.openapiType,
        this.loader.getRuleSet(),
        undefined,
        this.graph
      )
      runPromises.push(promise)
    }
    await Promise.all(runPromises)
    return this.formatter.format(msgs)
  }
}

export function getOpenapiTypes(type: string) {
  switch (type) {
    case "arm": {
      return OpenApiTypes.arm
    }
    case "data-plane": {
      return OpenApiTypes.dataplane
    }
    default:
      return OpenApiTypes.default
  }
}
