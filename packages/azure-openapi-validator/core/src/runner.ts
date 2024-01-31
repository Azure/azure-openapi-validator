import { LintCallBack, LintOptions, LogCallBack,  } from "./api"
import { OpenapiDocument } from "./document"
import { nodes } from "./jsonpath"
import { IRuleLoader} from "./ruleLoader"
import { SwaggerInventory } from "./swaggerInventory"
import { OpenApiTypes, ValidationMessage,LintResultMessage , IRule, IRuleSet, RuleScope } from "./types"

import {getRange,convertJsonPath} from "./utils"

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
    scope: RuleScope = "File",
    log: LogCallBack | undefined = undefined
  ) => {
    log?.call(undefined, `kja ENTER runRules`);
    const rulesToRun = Object.entries(ruleset.rules).filter(rule => rule[1].openapiType & openapiType && (rule[1].scope || "File")  === scope)
    const getArgs = (rule: IRule<any>, section: any, doc: any, location: string[]) => {
      if (isLegacyRule(rule)) {
        return [doc, section, location, { specPath: document, inventory}]
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
    log?.call(undefined, `kja for (const [ruleName, rule] of rulesToRun) {`)
    for (const [ruleName, rule] of rulesToRun) {
      log?.call(undefined, `kja ruleName: ${ruleName}`)
      let givens = rule.given || "$"
      if (!Array.isArray(givens)) {
        givens = [givens]
      }
      const targetDefinition = openapiDefinition
      log?.call(undefined, `kja targetDefinition: ${targetDefinition}`)
      for (const given of givens) {
        log?.call(undefined, `kja given: ${given}`)
        for (const section of nodes(targetDefinition, given)) {
          const fiieldMatch = rule.then.fieldMatch
          if (fiieldMatch) {
            for (const subSection of nodes(section.value, fiieldMatch)) {
              const location = section.path.slice(1).concat(subSection.path.slice(1))
              const args = getArgs(rule, subSection.value, targetDefinition, location)
              for await (const message of (rule.then.execute as any)(...args)) {
                emitResult(ruleName, rule, message, log)
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

    function emitResult(ruleName: string, rule: IRule<any>, message: ValidationMessage, log?: LogCallBack) {
      log?.call(undefined, `kja ENTER emitResult ruleName: ${ruleName}`);
      const readableCategory = rule.category
      const range = getRange(inventory,document,message.location)
      const msg:LintResultMessage = {
        id: rule.id,
        type: rule.severity,
        category: readableCategory,
        message: message.message,
        code: ruleName,
        sources: [document],
        jsonpath: convertJsonPath(openapiDefinition,message.location as string[]),
        range
      }
      sendMessage(msg)
    }
  }

  async execute(swaggerPaths: string[], options: LintOptions, cb?:LintCallBack, log?:LogCallBack) {
    log?.call(undefined, `kja ENTER execute`);
    const specsPromises = []
    for (const spec of swaggerPaths) {
      specsPromises.push(this.inventory.loadDocument(spec))
    }
    const documents = (await Promise.all(specsPromises)) as OpenapiDocument[]
    const msgs: LintResultMessage[] = []
    const sendMessage = (msg: LintResultMessage) => {
      msgs.push(msg)
      if (cb){
        cb(msg)
      }
    }
    const runPromises = []
    let runGlobalRuleFlag = false;
    for (const doc of documents) {
      for (const scope of  ["Global","File"]){
        if (scope === "Global" && runGlobalRuleFlag) {
          continue
        }
        else {
          runGlobalRuleFlag = true
        }
        log?.call(undefined, `kja running rules. Scope: ${scope}. docPath: ${doc.getDocumentPath()}`);
        const promise = this.runRules(
          doc.getDocumentPath(),
          doc.getObj(),
          sendMessage,
          options.openapiType,
          await this.loader.getRuleSet(),
          this.inventory,scope as RuleScope,
          log
        )
        runPromises.push(promise)
      }
    }
    await Promise.all(runPromises)
    return msgs
  }
}

