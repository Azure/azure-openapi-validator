/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
export const CreateOperationAsyncResponseValidation = "CreateOperationAsyncResponseValidation"

rules.push({
  id: "R4023",
  name: CreateOperationAsyncResponseValidation,
  severity: "error",
  category: "RPaaSViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.rpaas,
  appliesTo_JsonQuery: "$.paths.*.put",
  *run(doc, node, path) {
    if (node.responses["202"]) {
      yield {
        message: `202 is not a supported response code for PUT async response. Please use 201 instead.`,
        location: path.concat(["responses", "202"]),
      }
    }

    const isAsyncOperation =
      (node["x-ms-long-running-operation"] && node["x-ms-long-running-operation"] === true) || node["x-ms-long-running-operation-options"]

    if (isAsyncOperation) {
      if (!node.responses["201"]) {
        yield {
          message: `An async PUT operation must return 201.`,
          location: path.concat(["responses"]),
        }
      }

      if (!node["x-ms-long-running-operation"] || node["x-ms-long-running-operation"] !== true) {
        yield {
          message: `An async PUT operation must set '"x-ms-long-running-operation" : true''.`,
          location: path,
        }
      }
    }
  },
})
