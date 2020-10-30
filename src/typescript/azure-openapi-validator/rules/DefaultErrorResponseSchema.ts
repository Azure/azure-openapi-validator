/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { nodes, stringify } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "../rule"
import { getResolvedJson, getResolvedResponseSchema } from "./utilities/rules-helper"

export const DefaultErrorResponseSchema: string = "DefaultErrorResponseSchema"

rules.push({
  id: "R4007",
  name: DefaultErrorResponseSchema,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  async *asyncRun(doc, node, path) {
    const msg: string =
      "the default error response schema does not correspond to the schema documented at https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/common-api-details.md#error-response-content."

    const resolvedDoc = await getResolvedJson(doc)
    if (!resolvedDoc) {
      return
    }

    for (const n of nodes(doc, "$.paths.*.*.responses")) {
      const response: any = n.value
      if (response.default && response.default.schema) {
        const paths = n.path.concat(["default"])
        const pathExpression = stringify(paths.concat(["schema"]))

        const schema: any = await getResolvedResponseSchema(nodes(resolvedDoc, pathExpression)[0].value)

        /*
        * the schema should match below structure:
          {
            "error":{
              "code":"error code",
              "message":"error message"
              ...
            }
          }
        */
        if (!schema || !schema.error || !schema.error.code || !schema.error.message) {
          yield { message: `${msg}`, location: paths }
        }
      }
    }
  }
})
