/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MergeStates, OpenApiTypes, rules } from '../rule';
import { trimDescription } from './Utilities';

export const DescriptionTooShort: string = "DescriptionTooShort";
const minimumDescriptionLength = 20;

rules.push({
  id: "D4002",
  name: DescriptionTooShort,
  severity: "error",
  category: "DocViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.doc,
  appliesTo_JsonQuery: "$..description",
  run: function* (doc, node, path) {
    const msg: string = "Description length is too short.";
    if (typeof (node) !== 'string') {
      return;
    }

    // Skip 0-length nodes; these are picked up by another validator.
    const description: string = trimDescription(node);
    if (node.length > 0 && description.length < minimumDescriptionLength) {
      yield { message: `${msg} -- Length: ${description.length}`, location: path };
    }
  }
});

