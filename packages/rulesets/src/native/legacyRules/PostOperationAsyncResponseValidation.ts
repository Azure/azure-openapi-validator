/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
export const PostOperationAsyncResponseValidation = "PostOperationAsyncResponseValidation"

rules.push({
  id: "R4026",
  name: PostOperationAsyncResponseValidation,
  severity: "error",
  category: "RPaaSViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.rpaas,
  appliesTo_JsonQuery: "$.paths.*.post",
  *run(doc, node, path) {
    if (node.responses["201"]) {
      yield {
        message: `Only 202 is the supported response code for POST async response.`,
        location: path.concat(["responses", "201"])
      }
    }

    const isAsyncOperation =
      node.responses["202"] ||
      (node["x-ms-long-running-operation"] && node["x-ms-long-running-operation"] === true) ||
      node["x-ms-long-running-operation-options"]

    if (isAsyncOperation) {
      if (!node.responses["202"]) {
        yield {
          message: `An async POST operation must return 202.`,
          location: path.concat(["responses"])
        }
      }

      if (!node["x-ms-long-running-operation"] || node["x-ms-long-running-operation"] !== true) {
        yield {
          message: `An async POST operation must set '"x-ms-long-running-operation" : true''.`,
          location: path
        }
      }

      if (!node["x-ms-long-running-operation-options"]) {
        yield {
          message: `An async POST operation must set long running operation options 'x-ms-long-running-operation-options'`,
          location: path
        }
      }

      if (
        node["x-ms-long-running-operation-options"] &&
        (!node["x-ms-long-running-operation-options"]["final-state-via"] ||
          node["x-ms-long-running-operation-options"]["final-state-via"] != "location")
      ) {
        yield {
          message: `An async POST operation is tracked via Azure-AsyncOperation header. Set 'final-state-via' property to 'location' on 'x-ms-long-running-operation-options'`,
          location: path
        }
      }
    }
  }
})
