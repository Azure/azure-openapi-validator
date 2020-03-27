/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
import { getResponseSchema } from './utilities/rules-helper'
export const ErrorRespondSchema: string = "ErrorRespondSchema";

const jp = require('jsonpath');

rules.push({
  id: "R4007",
  name: ErrorRespondSchema,
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
    let schema = getResponseSchema(node.default, doc)
    let response = schema ? schema : node.default
    if (!response || !response.error || !response.error.code || !response.error.message) {
      yield { message: `${msg}`, location: path };
    }
  }
});