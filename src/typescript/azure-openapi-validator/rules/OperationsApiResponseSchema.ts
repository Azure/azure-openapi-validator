import { MessageReader } from "vscode-jsonrpc"
import { JsonPath } from "../../jsonrpc/types"
import { rules } from "../rule"
import { MergeStates, OpenApiTypes } from "../rule"
import { ResourceUtils } from "./utilities/resourceUtils"

export const OperationsApiResponseSchema: string = "OperationsApiResponseSchema"

rules.push({
  id: "R4018",
  name: OperationsApiResponseSchema,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,

  *run(doc, node, path) {
    const msg: string = 'The response schema of operations API "{0}" does not match the ARM specification. Please standardize the schema.'
    /**
     * 1 get the operations API and schema
     * 2 verify the schema
     * per ARM spec:https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/proxy-api-reference.md#exposing-available-operations
     */
    const utils = new ResourceUtils(doc)
    const operationsApi = utils.getOperationApi()
    if (operationsApi && operationsApi[1]) {
      let isValid = true
      const value = utils.getPropertyOfModelName(operationsApi[1], "value")
      if (value && value.items && value.items.$ref) {
        const operationsItems = utils.stripDefinitionPath(value.items.$ref)
        const name = utils.getPropertyOfModelName(operationsItems, "name")
        const display = utils.getPropertyOfModelName(operationsItems, "display")
        const isDataAction = utils.getPropertyOfModelName(operationsItems, "isDataAction")
        if (!name || !isDataAction || !display) {
          isValid = false
        } else {
          if (["description", "provider", "operation", "resource"].some(e => !utils.getPropertyOfModel(display, e))) {
            isValid = false
          }
        }
      } else {
        isValid = false
      }
      if (!isValid) {
        yield {
          message: msg.replace("{0}", operationsApi[0]),
          location: ["$", "paths", operationsApi[0]]
        }
      }
    }
  }
})
