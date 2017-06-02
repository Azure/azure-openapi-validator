/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const ArraySchemaMustHaveItems: string = "ArraySchemaMustHaveItems";

const jp = require('jsonpath');

rules.push({
  id: "S2009",
  name: ArraySchemaMustHaveItems,
  severity: "warning",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.definitions.*.properties[?(@.type)]",
  run: function* (doc, node, path) {
    const msg: string = "Please provide an 'items' property for array type: ";
    if (node.type === 'array') {
      if (!node.hasOwnProperty('items')) {
        yield { message: `${msg} '${path[path.length - 2]}'`, location: path.slice(0, path.length - 2) };
      }
    }
  }
});