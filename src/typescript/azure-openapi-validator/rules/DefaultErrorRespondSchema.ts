/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
import { getResponseSchema, getResolvedResponseSchema } from './utilities/rules-helper'
export const DefaultErrorRespondSchema: string = "DefaultErrorRespondSchema";

const jp = require('jsonpath');

rules.push({
  id: "R4007",
  name: DefaultErrorRespondSchema,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths..responses",
  asyncRun: async function* (doc, node, path) {
    const msg: string = "the default error response schema does not correspond to the schema documented at https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/common-api-details.md#error-response-content  ,consider fix it ";
    if (!node.default) {
      return
    }
    let schema = await getResolvedResponseSchema(node.default, doc, path.concat(["default"]) as string[])
    let response = schema ? schema : node.default.schema
    if (!response || !response.error || !response.error.code || !response.error.message) {
      yield { message: `${msg}`, location: path };
    }
  }
});