import { RuleContext } from "@microsoft.azure/openapi-validator-core"
import { ArmHelper } from "../utilities/arm-helper"

export function* trackedResourceMustHavePut(openapiSection: any, options: {}, ctx: RuleContext) {
  const armHelper = new ArmHelper(ctx?.document, ctx?.specPath, ctx?.inventory!)
  const allTrackedResources = armHelper.getTrackedResources()
  for (const re of allTrackedResources) {
    if (!re.operations.some((op) => op.httpMethod === "put")) {
      yield {
        location: ["paths", re.operations.find((op) => op.apiPath)!.apiPath, "put"],
        message: `The tracked resource ${re.modelName} does not define the put operation.`,
      }
    }
  }
}

export function* trackedResourceBeyondThirdLevel(openapiSection: any, options: {}, ctx: RuleContext) {
  const armHelper = new ArmHelper(ctx?.document, ctx?.specPath, ctx?.inventory!)
  const allTrackedResources = armHelper.getTrackedResources()
  const regex = /^.*\/providers\/microsoft\.\w+(?:\/\w+\/(\w+|{\w+})){4,}/gi
  for (const re of allTrackedResources) {
    if (!re.operations.some((op) => regex.test(op.apiPath))) {
      yield {
        location: ["paths", re.operations.find((op) => op.apiPath)!.apiPath],
        message: `The tracked resource ${re.modelName} beyonded 3 level of nesting.`,
      }
    }
  }
}

// Patch may not change the name, location, or type of the resource
export function* patchModelProperties(openapiSection: any, options: {}, ctx: RuleContext) {
  const armHelper = new ArmHelper(ctx?.document, ctx?.specPath, ctx?.inventory!)
  const allResources = armHelper.getAllResources().filter((re) => re.operations.some((op) => op.httpMethod === "patch"))
  for (const re of allResources) {
    const bodyParameterSchema = re.operations.find((op) => op.httpMethod === "patch")?.requestBodyParameter
    const disallowedProperties = ["name", "location", "type"]
    if (bodyParameterSchema && disallowedProperties.some((prop) => armHelper.getProperty(bodyParameterSchema, prop))) {
      yield {
        location: ["paths", re.operations.find((op) => op.apiPath)!.apiPath, "patch"],
        message: `Patch may not change the name, location, or type of the resource`,
      }
    }
  }
}

// support delete operation for all tracked resource , and all top level proxy resources.
export function* allResouresHaveDelete(openapiSection: any, options: {}, ctx: RuleContext) {
  const armHelper = new ArmHelper(ctx?.document, ctx?.specPath, ctx?.inventory!)
  const allTrackedResources = armHelper.getTrackedResources()
  const allTopLevelResource = armHelper.getTopLevelResources()
  for (const re of allTrackedResources.concat(allTopLevelResource)) {
    const deleteOp = re.operations.find((op) => op.httpMethod === "delete")
    if (deleteOp) {
      yield {
        location: ["paths", re.operations.find((op) => op.apiPath)!.apiPath],
        message: `All top level proxy and (tracked at all levels) resources MUST support delete.`,
      }
    }
  }
}
