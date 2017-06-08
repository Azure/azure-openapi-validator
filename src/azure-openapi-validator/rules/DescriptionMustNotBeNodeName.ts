/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const DescriptionMustNotBeNodeName: string = "DescriptionMustNotBeNodeName";
rules.push({
  id: "R3011",
  name: DescriptionMustNotBeNodeName,
  severity: "error",
  category: "RPCViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,

  appliesTo_JsonQuery: "$..*[?(@.description)]",
  run: function* (doc, node, path) {
    const msg: string = "Description must not match the name of the node it is supposed to describe.";
    // description can be of any type (including an object, so check for a string type)
    if (typeof (node.description) !== 'string') {
      return;
    }
    const nodeName = <any>path[path.length - 1];

    if (!isNaN(nodeName)) {
      // if name is a property defined within the node, try and access it.
      if (!('name' in node)) {
        return;
      }
      if (node['name'].toLowerCase() === TrimDescription(node.description)) {
        yield { message: `${msg} Node name:'${node.name}' Description:'${node.description}'`, location: path.concat(['description']) };
      }
    }
    else if (nodeName.toLowerCase() === TrimDescription(node.description)) {
      yield { message: `${msg} Node name:'${nodeName}' Description: '${node.description}'`, location: path.concat(['description']) };
    } else if (TrimDescription(node.description) === 'description') {
      yield { message: "Description cannot be named as 'Description'.", location: path.concat(['description']) };
    }
  }
});

function TrimDescription(description: string): string {
  return description.trim().replace(/\./g, '').toLowerCase();
}