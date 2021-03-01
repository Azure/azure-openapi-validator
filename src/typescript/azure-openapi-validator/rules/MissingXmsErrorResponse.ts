/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule"
export const MissingXmsErrorResponse: string = "MissingXmsErrorResponse"

const jp = require("jsonpath")

rules.push({
  id: "R4032",
  name: MissingXmsErrorResponse,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths.*.*.responses.*",
  *run(doc, node, path) {
    const msg: string = "Response code {0} is defined without a x-ms-error-response."
    const httpMethod = path[path.length - 3].toString()
    const errorCode = path[path.length -1].toString()
    if (httpMethod === "head" && errorCode === "404") {
      return
    }
    if (errorCode.startsWith("4") || errorCode.startsWith("5")) {
      if (!node['x-ms-error-response']) {
       yield { message: `${msg}`.replace("{0}",errorCode), location: path }
      }
    }
  }
})
