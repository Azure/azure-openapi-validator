// @ts-nocheck
import { Message } from "./types"
import { SwaggerInventory } from "./swaggerInventory"
import { nodes } from "./jsonpath"
import { IRuleLoader} from "./ruleLoader"
import { OpenApiTypes, ValidationMessage } from "./types"
import { IRule, IRuleSet } from "./types"
import { IFormatter } from "./formatter"
import { LintCallBack, LintOptions, LintResultMessage } from "."
import { OpenapiDocument } from "./document"
import { SwaggerHelper } from "./swaggerHelper"

const isLegacyRule = (rule: IRule<any>) => {
  return rule.then.execute.name === "run"
}

export class LintRunner<T> {
  constructor(private loader: IRuleLoader, private inventory: SwaggerInventory, private formatter: IFormatter<T>) {}

  runRules = async (
    document: string,
    openapiDefinition: any,
    sendMessage: (m: Message) => void,
    openapiType: OpenApiTypes,
    ruleset: IRuleSet,
    inventory?: SwaggerInventory
  ) => {
    const rulesToRun = Object.entries(ruleset.rules).filter(rule => rule[1].openapiType & openapiType)
    const swaggerHelper = new SwaggerHelper(openapiDefinition, document, inventory)
    let resolvedSwagger
    if (rulesToRun.some(rule => rule[1].resolved)) {
      resolvedSwagger = await swaggerHelper.resolveSchema(openapiDefinition)
    }

    const getArgs = (rule: IRule<any>, section: any, doc: any, location: string[]) => {
      if (isLegacyRule(rule)) {
        return [doc, section, location, { specPath: document, inventory, utils: swaggerHelper }]
      } else {
        return [
          section,
          rule.then.options,
          {
            document: doc,
            location,
            specPath: document,
            inventory
          }
        ]
      }
    }
    for (const [ruleName, rule] of rulesToRun) {
      let givens = rule.given || "$"
      if (!Array.isArray(givens)) {
        givens = [givens]
      }
      const targetDefinition = rule.resolved ? resolvedSwagger : openapiDefinition
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

  async execute(swaggerPaths: string[], options: LintOptions,cb?:LintCallBack) {
    const specsPromises = []
    for (const spec of swaggerPaths) {
      specsPromises.push(this.inventory.loadDocument(spec))
    }
    const documents = (await Promise.all(specsPromises)) as OpenapiDocument[]
    const msgs = []
    const sendMessage = (msg: Message) => {
      msgs.push(msg)
      if (cb){
        cb(this.formatter.format(msg)[0] as unknown as LintResultMessage)
      }
    }
    const runPromises = []
    for (const doc of documents) {
      const promise = this.runRules(
        doc.getDocumentPath(),
        doc.getObj(),
        sendMessage,
        options.openapiType,
        await this.loader.getRuleSet(),
        this.inventory
      )
      runPromises.push(promise)
    }
    await Promise.all(runPromises)
    return this.formatter.format(msgs)
  }
}


