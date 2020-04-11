/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
import { getResolvedResponseSchema, getResolvedJson } from './utilities/rules-helper'
import { nodes, stringify } from 'jsonpath'

export const DefaultErrorResponseSchema: string = "DefaultErrorResponseSchema";

rules.push({
  id: "R4007",
  name: DefaultErrorResponseSchema,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$",
  asyncRun: async function* (doc, node, path) {
    const msg: string = "the default error response schema does not correspond to the schema documented at https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/common-api-details.md#error-response-content."

    let resolvedDoc = await getResolvedJson(doc)

    for (const n of nodes(doc, "$.paths..responses")) {
      let response: any = n.value
      if (response.default && response.default.schema) {

        let paths = n.path.concat(["default"])
        let pathExpression = stringify(paths.concat(["schema"]))

        let schema = await getResolvedResponseSchema(nodes(resolvedDoc, pathExpression)[0].value)

        if (!schema || !schema.error || !schema.error.code || !schema.error.message) {
          yield { message: `${msg}`, location: paths };
        }
      }
    }
  }
});