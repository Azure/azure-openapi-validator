import { RuleContext } from "@microsoft.azure/openapi-validator-core"
import { ArmHelper } from "../utilities/arm-helper"
import _ from "lodash"

export function* trackedResourcesMustHavePut(openapiSection: any, options: {}, ctx: RuleContext) {
  const armHelper = new ArmHelper(ctx?.document, ctx?.specPath, ctx?.inventory!)
  const allTrackedResources = armHelper.getTrackedResources()
  for (const re of allTrackedResources) {
    if (!re.operations.some((op) => op.httpMethod === "put")) {
      yield {
        location: ["paths", re.operations.find((op) => op.apiPath)!.apiPath, "put"],
        message: `The tracked resource ${re.modelName} does not a corresponding put operation.`,
      }
    }
  }
}

export function* trackedResourceBeyondsThirdLevel(openapiSection: any, options: {}, ctx: RuleContext) {
  const armHelper = new ArmHelper(ctx?.document, ctx?.specPath, ctx?.inventory!)
  const allTrackedResources = armHelper.getTrackedResources()
  const regex = /^.*\/providers\/microsoft\.\w+(?:\/\w+\/(\w+|{\w+})){4,}/gi
  for (const re of allTrackedResources) {
    if (re.operations.some((op) => regex.test(op.apiPath))) {
      yield {
        location: ["paths", re.operations.find((op) => op.apiPath)!.apiPath],
        message: `The tracked resource ${re.modelName} is beyond third level of nesting.`,
      }
    }
  }
}

// support delete operation for all tracked resource , and all top level proxy resources.
export function* allResourcesHaveDelete(openapiSection: any, options: {}, ctx: RuleContext) {
  const armHelper = new ArmHelper(ctx?.document, ctx?.specPath, ctx?.inventory!)
  const allTrackedResources = armHelper.getTrackedResources()
  const allTopLevelResource = armHelper.getTopLevelResources()
  const allResources = _.uniq(allTrackedResources.concat(allTopLevelResource))
  for (const re of allResources) {
    const deleteOp = re.operations.find((op) => op.httpMethod === "delete")
    if (!deleteOp) {
      yield {
        location: ["paths", re.operations.find((op) => op.apiPath)!.apiPath],
        message: `The resource ${re.modelName} does not have a corresponding delete operation.`,
      }
    }
  }
}
