/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
import { trimDescription } from './utilities';

export const DescriptionMustNotBeNodeName: string = "DescriptionMustNotBeNodeName";

/**
 * RULE DESCRIPTION: This rule avoids situations in which a node's description matches either the key it
 * is associated with, or the `name` sibling in the same dictionary. It also prohibits the usage of
 * `description` as a description.
 * 
 * This rule should never be disabled.
 **/

rules.push({
  id: "D401",
  name: DescriptionMustNotBeNodeName,
  severity: "error",
  category: "DocumentationViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.default,

  appliesTo_JsonQuery: "$..*[?(@.description)]",
  run: function* (doc, node, path) {
    const msg: string = "Description must not match the name of the node it is supposed to describe.";
      
    if (typeof (node.description) !== 'string') {
      return;
    }

    const nodeName = <any>path[path.length - 1];
    const description = trimDescription(node.description);

    if ('name' in node && typeof (node.name) === 'string' && trimDescription(node.name.toLowerCase()) === description) 
    {
      yield { message: `${msg} Node name:'${node.name}' Description:'${node.description}'`, location: path.concat(['description']) };
    }
    if (typeof (nodeName) === 'string' && nodeName.toLowerCase() === description) 
    {
      yield { message: `${msg} Node name:'${nodeName}' Description: '${node.description}'`, location: path.concat(['description']) };
    }
    if (trimDescription(description) === 'description')
    {
      yield { message: "Description cannot be 'description'", location: path.concat(['description']) };
    }
  }
});
