import { LintCallBack, LintOptions } from "./api"
import { OpenapiDocument } from "./document"
import { nodes } from "./jsonpath"
import { IRuleLoader } from "./ruleLoader"
import { SwaggerInventory } from "./swaggerInventory"
import { OpenApiTypes, ValidationMessage, LintResultMessage, IRule, IRuleSet, RuleScope } from "./types"

import { getRange, convertJsonPath } from "./utils"

const isLegacyRule = (rule: IRule<any>) => {
  return rule.then.execute.name === "run"
}

export class LintRunner<T> {
  constructor(private loader: IRuleLoader, private inventory: SwaggerInventory) {}

  runRules = async (
    document: string,
    openapiDefinition: any,
    sendMessage: (m: LintResultMessage) => void,
    openapiType: OpenApiTypes,
    ruleset: IRuleSet,
    inventory: SwaggerInventory,
    scope: RuleScope = "File"
  ) => {
    const rulesToRun = Object.entries(ruleset.rules).filter(
      (rule) => rule[1].openapiType & openapiType && (rule[1].scope || "File") === scope
    )
    const getArgs = (rule: IRule<any>, section: any, doc: any, location: string[]) => {
      if (isLegacyRule(rule)) {
        return [doc, section, location, { specPath: document, inventory }]
      } else {
        return [
          section,
          rule.then.options,
          {
            document: doc,
            location,
            specPath: document,
            inventory,
          },
        ]
      }
    }
    for (const [ruleName, rule] of rulesToRun) {
      let givens = rule.given || "$"
      if (!Array.isArray(givens)) {
        givens = [givens]
      }
      const targetDefinition = openapiDefinition
      for (const given of givens) {
        for (const section of nodes(targetDefinition, given)) {
          const fiieldMatch = rule.then.fieldMatch
          if (fiieldMatch) {
            for (const subSection of nodes(section.value, fiieldMatch)) {
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
      const range = getRange(inventory, document, message.location)
      const msg: LintResultMessage = {
        id: rule.id,
        type: rule.severity,
        category: readableCategory,
        message: message.message,
        code: ruleName,
        sources: [document],
        jsonpath: convertJsonPath(openapiDefinition, message.location as string[]),
        range,
      }
      sendMessage(msg)
    }
  }

  async execute(swaggerPaths: string[], options: LintOptions, cb?: LintCallBack) {
    const specsPromises = []
    for (const spec of swaggerPaths) {
      specsPromises.push(this.inventory.loadDocument(spec))
    }
    const documents = (await Promise.all(specsPromises)) as OpenapiDocument[]
    const msgs: LintResultMessage[] = []
    const sendMessage = (msg: LintResultMessage) => {
      msgs.push(msg)
      if (cb) {
        cb(msg)
      }
    }
    const runPromises = []
    let runGlobalRuleFlag = false
    for (const doc of documents) {
      for (const scope of ["Global", "File"]) {
        if (scope === "Global" && runGlobalRuleFlag) {
          continue
        } else {
          runGlobalRuleFlag = true
        }
        const promise = this.runRules(
          doc.getDocumentPath(),
          doc.getObj(),
          sendMessage,
          options.openapiType,
          await this.loader.getRuleSet(),
          this.inventory,
          scope as RuleScope
        )
        runPromises.push(promise)
      }
    }
    await Promise.all(runPromises)
    return msgs
  }
}
