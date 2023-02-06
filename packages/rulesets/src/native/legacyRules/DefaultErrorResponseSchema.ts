/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules, SwaggerInventory } from "@microsoft.azure/openapi-validator-core"
import { Workspace } from "../utilities/swagger-workspace"

export const DefaultErrorResponseSchema = "DefaultErrorResponseSchema"

rules.push({
  id: "R4007",
  name: DefaultErrorResponseSchema,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths.*.*.responses",
  *run(doc, node, path, ctx) {
    const msg =
      "the default error response schema does not correspond to the schema documented at https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/common-api-details.md#error-response-content."

    const response: any = node
    if (response.default) {
      const paths = path.concat(["default"])
      if (response.default.schema) {
        const schema: any = Workspace.jsonPath(paths.concat("schema"), doc)
        if (schema) {
          const errorDefinition = Workspace.getProperty(
            { file: ctx?.specPath!, value: schema },
            "error",
            ctx?.inventory! as SwaggerInventory
          )
          if (errorDefinition && errorDefinition.value) {
            const code = Workspace.getProperty(errorDefinition, "code", ctx?.inventory! as SwaggerInventory)
            const message = Workspace.getProperty(errorDefinition, "message", ctx?.inventory! as SwaggerInventory)
            if (code && message) {
              return
            }
          }
        }
      }
      yield { message: `${msg}`, location: paths }
    }
  },
})
