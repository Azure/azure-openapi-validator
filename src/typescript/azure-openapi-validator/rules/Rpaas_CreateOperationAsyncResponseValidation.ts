/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule"
export const Rpaas_CreateOperationAsyncResponseValidation: string = "Rpaas_CreateOperationAsyncResponseValidation"

rules.push({
  id: "R4023",
  name: Rpaas_CreateOperationAsyncResponseValidation,
  severity: "error",
  category: "RPaaSViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.rpaas,
  appliesTo_JsonQuery: "$.paths.*.put",
  *run(doc, node, path) {
    if (node.responses["202"]) {
      yield {
        message: `[RPaaS] Only 201 is the supported response code for PUT async response.`,
        location: path.concat(["responses", "202"])
      }
    }

    const isAsyncOperation = node.responses["201"]
      || (node["x-ms-long-running-operation"] && node["x-ms-long-running-operation"] == true)
      || node["x-ms-long-running-operation-options"];

    if (isAsyncOperation) {
      if (!node.responses["201"]) {
        yield {
          message: `[RPaaS] An async PUT operation must return 201.`,
          location: path.concat(["responses"])
        }
      }

      if (!node["x-ms-long-running-operation"] || node["x-ms-long-running-operation"] !== true) {
        yield {
          message: `[RPaaS] An async PUT operation must set '"x-ms-long-running-operation" : true''.`,
          location: path
        }
      }

      if (!node["x-ms-long-running-operation-options"]) {
        yield {
          message: `[RPaaS] An async PUT operation must set long running operation options 'x-ms-long-running-operation-options'`,
          location: path
        }
      }

      if (node["x-ms-long-running-operation-options"] &&
        (!node["x-ms-long-running-operation-options"]["final-state-via"]
        || node["x-ms-long-running-operation-options"]["final-state-via"] != "azure-async-operation")) {
        yield {
          message: `[RPaaS] An async PUT operation is tracked via Azure-AsyncOperation header. Set 'final-state-via' property to 'azure-async-operation' on 'x-ms-long-running-operation-options'`,
          location: path
        }
      }
    }
  }
})
