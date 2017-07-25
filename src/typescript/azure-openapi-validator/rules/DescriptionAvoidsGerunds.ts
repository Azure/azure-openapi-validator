/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';

export const DescriptionAvoidsGerunds: string = "DescriptionAvoidsGerunds";

rules.push({
  id: "D4004",
  name: DescriptionAvoidsGerunds,
  severity: "warning",
  category: "DocViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.doc,
  appliesTo_JsonQuery: "$..description",
  run: function* (doc, node, path) {
    const msg: string = "Description contains possible gerunds.";
    if (typeof (node) !== 'string') {
      return;
    }

    const nodeValue: string = <string>node;

    // Known good words which are not gerunds, but do end in -ing
    const goodWords = ["string"];

    var gerunds = nodeValue.match(/\b\w+ing\b/g);
    if (gerunds != null) {
      let filtered = gerunds.filter(word => goodWords.indexOf(word.toLowerCase()) == -1);
      if (filtered.length > 0) {
        yield { message: `${msg} -- Possible gerunds are ${filtered}`, location: path };
      }
    }
  }
});
