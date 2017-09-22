/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MergeStates, OpenApiTypes, rules } from '../rule';
import { trimDescription } from './utilities';

export const DescriptionTooShort: string = "DescriptionTooShort";
const minimumDescriptionLength = 20;

/**
 * RULE DESCRIPTION: This rule checks for descriptions which are too short to be useful. The limit of
 * 20 characters was established through the thought experiment of concocting an individual
 * description which would be considered 'minimally useful' using Azure terminology:
 *      "The ARG associated with a VM." - 27 chars
 * This was reduced by a lenient amount (about the length of 'associated') to come up with the minimum length.
 *
 * This rule should never be disabled.
 */

rules.push({
  id: "D402",
  name: DescriptionTooShort,
  severity: "error",
  category: "DocumentationViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.default,
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

