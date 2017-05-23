/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const ControlCharactersAreNotAllowed: string = "ControlCharactersAreNotAllowed";

rules.push({
  id: "SE40",
  name: "ControlCharactersAreNotAllowed",
  severity: "error",
  category: ["SDKViolation"],
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$..*",
  run: function* (doc, node, path) {
    const msg: string = "May not contain control characters: ";
    if (typeof node === "string") {
      const nodeValue: string = <string>node;
      var controlChars = nodeValue.split('').filter(ch => ch < ' ' && ch !== '\t' && ch !== '\n' && ch !== '\r');
      if (controlChars.length > 0) {
        for (var token in controlChars) {
          yield { message: "$(msg) Character:'${element}' in:'${nodeValue}'", location: path };
        }
      }
    }
  }
});

function TrimDescription(description: string): string {
  return description.trim().replace(/\./g, '').toLowerCase();
}