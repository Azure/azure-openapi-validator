/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
import { getSuccessfulResponseSchema } from './utilities/rules-helper';
export const PageableOperation: string = "PageableOperation";

const jp = require('jsonpath');

rules.push({
  id: "R2029",
  name: PageableOperation,
  severity: "warning",
  category: "SDKViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$.paths[?(@.get)]",
  run: function* (doc, node, path) {
    const operations = Object.keys(node);
    const getKey = operations.find(key => {
      return key.toLowerCase() === 'get';
    });

    var schemaProperties = getSuccessfulResponseSchema(node[getKey], doc)

    function hasArrayProperty(schema) {
      let arrayPresent: boolean = false;
      Object.keys(schema).forEach(function (key) {
        if (schema[key].type === 'array') {
          arrayPresent = true;
        }
      });
      return arrayPresent;
    }

    // Why length 3?
    // 1 - Array
    // 2 - NextLink
    // 3 - Count
    if (schemaProperties != undefined && schemaProperties != null && Object.keys(schemaProperties).length <= 3) {
      if (hasArrayProperty(schemaProperties) && !('x-ms-pageable' in node[getKey])) {
        yield { message: `Based on the response model schema, operation '${node[getKey].operationId}' might be pageable. Consider adding the x-ms-pageable extension.`, location: path.concat(getKey) };
      }
    }
  }
});
