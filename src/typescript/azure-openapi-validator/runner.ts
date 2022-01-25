import { Message } from "../jsonrpc/types"
import { DocumentDependencyGraph } from "./depsGraph"
import { nodes } from "./jsonpath"
import { IRuleLoader } from "./ruleLoader"
import { MergeStates, OpenApiTypes, ValidationMessage } from "./rule"
import { IRule, IRuleSet } from "./types"
import { IFormatter } from "./formatter"
import { LintOptions } from "."
import { OpenapiDocument } from "./document"

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
    for (const [ruleName, rule] of rulesToRun) {
      let givens = rule.given || "$"
      if (!Array.isArray(givens)) {
        givens = [givens]
      }
      for (const given of givens) {
        for (const section of nodes(openapiDefinition, given)) {
          const subPath = rule.then.subPath
          if (subPath) {
            for (const subSection of nodes(section.value, subPath)) {
              for await (const message of rule.then.execute(
                openapiDefinition,
                subSection.value,
                section.path.slice(1).concat(subSection.path.slice(1)),
                {
                  specPath: document,
                  graph
                },
                rule.then.options
              )) {
                emitResult(ruleName, rule, message)
              }
            }
          } else {
            for await (const message of rule.then.execute(
              openapiDefinition,
              rule.then.subPath ? section.property : section.value,
              section.path.slice(1),
              {
                specPath: document,
                graph
              },
              rule.then.options
            )) {
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
