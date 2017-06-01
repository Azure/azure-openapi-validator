/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const ArraySchemaMustHaveItems: string = "ArraySchemaMustHaveItems";

const jp = require('jsonpath');

rules.push({
  id: "SE41",
  name: ArraySchemaMustHaveItems,
  severity: "warning",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.definitions.*.properties.*.type",
  run: function* (doc, node, path) {
    const msg: string = "Please provide an items property for array type: ";
    if (node === 'array') {
      // climb up the json path to get hold of the parent element
      // check if the parent element has an items node defined
      const propObject = jp.query(doc, path.splice(0, path.length - 2).join('.'));

      // if not, we have a violation
      if (!(propObject.hasOwnProperty('items'))) {
        yield { message: `${msg} ${path[path.length - 2]}`, location: path.splice(0, path.length - 2) };
      }
    }
  }
});

function TrimDescription(description: string): string {
  return description.trim().replace(/\./g, '').toLowerCase();
}