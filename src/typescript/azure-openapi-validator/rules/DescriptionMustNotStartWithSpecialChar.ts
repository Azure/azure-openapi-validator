/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const DescriptionMustNotStartWithSpecialChar: string = "DescriptionMustNotStartWithSpecialChar";
rules.push({
  id: "R2333",
  name: DescriptionMustNotStartWithSpecialChar,
  severity: "error",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,

  appliesTo_JsonQuery: "$..*[?(@.description)]",
  run: function* (doc, node, path) {
    const msg: string = "Description must not start with special character.";
    // description can be of any type (including an object, so check for a string type)
    if (typeof (node.description) !== 'string') {
      return;
    }
    const description = TrimDescription(node.description);

    // Check if description start with following characters: ! @ # $ % ^
    if (/^[!@#$%\^]/g.exec(description) !== null) {
      yield { message: `${msg} Node name:'${node.name}' Description:'${node.description}'`, location: path.concat(['description']) };
    }
  }
});

function TrimDescription(description: string): string {
  return description.trim().replace(/\./g, '').toLowerCase();
}
