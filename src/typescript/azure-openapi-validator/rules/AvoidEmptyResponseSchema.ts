/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const AvoidEmptyResponseSchema: string = "AvoidEmptyResponseSchema";

const jp = require('jsonpath');

rules.push({
  id: "R4008",
  name: AvoidEmptyResponseSchema,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.paths..responses..schema",
  run: function* (doc, node, path) {
    const msg: string = "Response schema must not be empty";
    if (!Object.keys(node).length) {
      yield { message: `${msg}'`, location: path };
    }
  }
});