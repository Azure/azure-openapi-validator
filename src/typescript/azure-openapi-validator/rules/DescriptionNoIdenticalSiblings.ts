/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MergeStates, OpenApiTypes, rules } from '../rule';
import * as jp from 'jsonpath';
import { trimDescription } from './utilities';
import { JsonPath } from '../../jsonrpc/types';

export const DescriptionNoIdenticalSiblings: string = "DescriptionNoIdenticalSiblings";
const minimumDescriptionLength = 20;

var checkedPaths: string[] = [];

rules.push({
  id: "D4003",
  name: DescriptionNoIdenticalSiblings,
  severity: "error",
  category: "DocViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.doc,
  appliesTo_JsonQuery: "$..*[?(@.description)]",
  run: function* (doc, node, path) {
    // JSONPath does not have a parent operator, so we need to do some manipulation
    // of the 'path', along with an additional search (and keep a record of the parents)
    // in order to compare multiple nodes at once.
    
    var parentPath: JsonPath;
    if (Array.isArray(node)) { // 1. If the node is an array, it's a parent
      parentPath = path;
    }
    else { // 2. If the node is an object, travel one up the tree
      parentPath = path.slice(0, -1);
    }

    var parentString = jp.stringify(parentPath);
    if (checkedPaths.indexOf(parentString) != -1) {
      return;
    }
    checkedPaths.push(parentString);

    const childExpression = `${parentString}.*.description`;
    const children: any[] = jp.apply(doc, childExpression, description => trimDescription(description));

    var duplicates: {[description:string]: JsonPath[]} = {};
    for (const child of children) {
      if (!(child.value in duplicates)) {
        duplicates[child.value] = [];
      }
      duplicates[child.value].push(child.path);
    }

    for (const desc in duplicates) {
      if (duplicates[desc].length > 1) {
        const dupePaths = duplicates[desc].map( path => jp.stringify(path) ).join(', ');
        yield {
          message: `Found duplicate descriptions at paths: ${dupePaths}`,
          location: parentPath
        }
      }
    }
  },
  cleanup: function () {
    checkedPaths = [];
  }
});

