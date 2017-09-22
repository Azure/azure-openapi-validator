/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';

export const DescriptionAvoidsGerunds: string = "DescriptionAvoidsGerunds";

/**
 * RULE DESCRIPTION: This rule helps writers avoid the use of gerunds, which are verbs that
 * have been turned into nouns by the suffix `-ing`. These terms cause problems for ESL readers
 * and machine translation, in part because they are related to (and confused for) another
 * difficult part of the English language, present participle verbs. Present participle
 * verbs are also difficult, but not as necessary to remove, although writers should take
 * doing so under advisement.
 * 
 * As a result, this rule is a `warning` and indicates `possible` gerunds. Once a description
 * has been edited to remove gerunds, if it contains present participle verbs, it should be
 * added to the `suppress` list for the node.
 **/

rules.push({
  id: "D404",
  name: DescriptionAvoidsGerunds,
  severity: "warning",
  category: "DocumentationViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.default,
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
    if (gerunds !== null) {
      let filtered = gerunds.filter(word => goodWords.indexOf(word.toLowerCase()) == -1);
      if (filtered.length > 0) {
        yield { message: `${msg} -- Possible gerunds are ${filtered}`, location: path };
      }
    }
  }
});
