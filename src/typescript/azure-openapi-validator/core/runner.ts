import { Message, IRuleFunctionLegacy } from "./types"
import { DocumentDependencyGraph } from "./depsGraph"
import { nodes } from "./jsonpath"
import { IRuleLoader, SpectralRuleLoader } from "./ruleLoader"
import { OpenApiTypes, ValidationMessage } from "./types"
import { IRule, IRuleSet } from "./types"
import { IFormatter } from "./formatter"
import { LintOptions } from "."
import { OpenapiDocument } from "./document"
import { SwaggerUtils } from "./swaggerUtils"
import { stringify } from "querystring"
const { Spectral } = require("@stoplight/spectral-core")

const isLegacyRule = (rule: IRule<any>) => {
  return rule.then.execute.name === "run"
}

export class LintRunner<T> {
  constructor(private loader: IRuleLoader, private graph: DocumentDependencyGraph, private formatter: IFormatter<T>) {}

  runRules = async (
    document: string,
    openapiDefinition: any,
    sendMessage: (m: Message) => void,
    openapiType: OpenApiTypes,
    ruleset: IRuleSet,
    graph?: DocumentDependencyGraph
  ) => {
    const rulesToRun = Object.entries(ruleset.rules).filter(rule => rule[1].openapiType & openapiType)
    const swaggerUtils = new SwaggerUtils(openapiDefinition, document, graph)
    let resolvedSwagger
    if (rulesToRun.some(rule => rule[1].resolved)) {
      resolvedSwagger = await swaggerUtils.resolveSchema(openapiDefinition)
    }

    const getArgs = (rule: IRule<any>, section: any, doc: any, location: string[]) => {
      if (isLegacyRule(rule)) {
        return [doc, section, location, { specPath: document, graph, utils: swaggerUtils }]
      } else {
        return [
          section,
          rule.then.options,
          {
            document: doc,
            location,
            specPath: document,
            graph,
            utils: swaggerUtils
          }
        ]
      }
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
              const args = getArgs(rule, subSection.value, targetDefinition, location)
              for await (const message of (rule.then.execute as any)(...args)) {
                emitResult(ruleName, rule, message)
              }
            }
          } else {
            const location = section.path.slice(1)
            const args = getArgs(rule, section.value, targetDefinition, location)
            for await (const message of (rule.then.execute as any)(...args)) {
              emitResult(ruleName, rule, message)
            }
          }
        }
      }
    }

    function emitResult(ruleName: string, rule: IRule<any>, message: ValidationMessage) {
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
            jsonPath: message.location
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

  async runSpectral(swaggerPaths: string[], options: LintOptions) {
    const linter = new Spectral()
    const rules = await new SpectralRuleLoader().getRuleSet()
    linter.setRuleset(rules)
    const mergedResults = []
    const convertSeverity = (severity: number) => {
      switch (severity) {
        case 0:
          return "error"
        case 1:
          return "warning"
        case 2:
          return "info"
        default:
          return "info"
      }
    }
    const convertRange = (range: any) => {
      return {
        start: {
          line: range.start.line + 1,
          column: range.start.character
        },
        end: {
          line: range.end.line + 1,
          column: range.end.character
        }
      }
    }

    const format = (result, spec) => {
      return {
        code: result.code,
        message: result.message,
        type: convertSeverity(result.severity),
        "json-path": stringify(result.path),
        range: convertRange(result.range),
        sources: [`${spec}:${result.range.start.line}:${result.range.start.character}`],
        location: {
          line: result.range.start.line + 1,
          column: result.range.start.character
        }
      }
    }
    for (const spec of swaggerPaths) {
      const results = await linter.run(spec)
      mergedResults.push(...results.map(result => format(result, spec)))
    }
    return mergedResults
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
        await this.loader.getRuleSet(),
        this.graph
      )
      runPromises.push(promise)
    }
    await Promise.all(runPromises)
  //  const spectralResult = await this.runSpectral(swaggerPaths, options)
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
