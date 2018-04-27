/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
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

    const schemaRef = node[getKey]['responses']['200']['schema']['$ref'];
    const schemaPath: string[] = (<string>schemaRef).split('/');
    const schemaProperties = doc.definitions[schemaPath[2]].properties;

    const valueKey = Object.keys(schemaProperties).find(key => {
      return key.toLowerCase() === 'value';
    });

    if (valueKey != undefined) {
      if (schemaProperties[valueKey].type === 'array') {
        yield { message: `Operation '${node[getKey].operationId}' might be pageable. Consider adding the x-ms-pageable swagger extension.`, location: path.concat(getKey) };

      }
    }
  }
});
