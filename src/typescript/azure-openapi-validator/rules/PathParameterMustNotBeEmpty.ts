/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const PathParametersMustNotBeEmpty: string = "PathParametersMustNotBeEmpty";

rules.push({
  id: "R2067",
  name: PathParametersMustNotBeEmpty,
  severity: "error",
  category: "RPCViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,

  appliesTo_JsonQuery: "$.paths..parameters[?(@.in=='path')]",
  run: function* (doc, node, path) {

    const pathNodes: string[] = (<string>path[1]).split('/');

    if (!Object.keys(node).includes("minLength") || node.minLength < 1) {
      yield { message: `Path parameters should should have the 'minLength' attribute with a value > 1: Parameter '${node.name}' in:'${path[1]}'. `, location: path };
    }
  }
});