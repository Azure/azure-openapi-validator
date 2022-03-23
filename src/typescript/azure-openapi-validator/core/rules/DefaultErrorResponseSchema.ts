/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../types"
import { getResolvedSchemaByPath } from "./utilities/rules-helper"

export const DefaultErrorResponseSchema: string = "DefaultErrorResponseSchema"

rules.push({
  id: "R4007",
  name: DefaultErrorResponseSchema,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths.*.*.responses",
  async *run(doc, node, path, ctx) {
    const msg: string =
      "the default error response schema does not correspond to the schema documented at https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/common-api-details.md#error-response-content."

    const response: any = node
    if (response.default && response.default.schema) {
      const paths = path.concat(["default", "schema"])

      const schema: any = getResolvedSchemaByPath(doc, paths as string[], ctx.graph)

      const utils = ctx.utils
      if (schema) {
        const errorDefinition = utils?.getPropertyOfModel(schema, "error")
        if (errorDefinition) {
          const code = utils?.getPropertyOfModel(errorDefinition, "code")
          const message = utils?.getPropertyOfModel(errorDefinition, "message")
          if (code && message) {
            return
          }
        }
      }
      yield { message: `${msg}`, location: paths }
    }
  }
})
