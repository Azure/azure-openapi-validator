import { rules, MergeStates, OpenApiTypes } from "@microsoft.azure/openapi-validator-core"

import { ArmHelper } from "../utilities/arm-helper"

export const OperationsApiResponseSchema = "OperationsApiResponseSchema"

rules.push({
  id: "R4018",
  name: OperationsApiResponseSchema,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,

  *run(doc, node, path, ctx) {
    const msg = 'The response schema of operations API "{0}" does not match the ARM specification. Please standardize the schema.'
    /**
     * 1 get the operations API and schema
     * 2 verify the schema
     * per ARM spec:https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/proxy-api-reference.md#exposing-available-operations
     */
    const utils = new ArmHelper(doc, ctx?.specPath!, ctx?.inventory!)
    const operationsApi = utils.getOperationApi()
    if (operationsApi && operationsApi[1]) {
      let isValid = true
      const value = utils?.getProperty(operationsApi[1] as any, "value")
      const items = utils.getAttribute(value, "items")

      if (value && items) {
        const name = utils?.getProperty(items, "name")
        const display = utils?.getProperty(items, "display")
        const isDataAction = utils?.getProperty(items, "isDataAction")
        if (!name || !isDataAction || !display) {
          isValid = false
        } else {
          if (["description", "provider", "operation", "resource"].some((e) => !utils?.getProperty(display, e))) {
            isValid = false
          }
        }
      } else {
        isValid = false
      }
      if (!isValid && operationsApi[0]) {
        yield {
          message: msg.replace("{0}", operationsApi[0] as string),
          location: ["$", "paths", operationsApi[0] as string],
        }
      }
    }
  },
})
