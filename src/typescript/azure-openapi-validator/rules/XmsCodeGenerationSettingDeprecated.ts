/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const XmsCodeGenerationSettingDeprecated: string = "XmsCodeGenerationSettingDeprecated";
rules.push({
  id: "R4006",
  name: XmsCodeGenerationSettingDeprecated,
  severity: "warning",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,

  appliesTo_JsonQuery: "$.info[\"x-ms-code-generation-settings\"]",
  run: function* (doc, node, path) {
    if (node) {
      yield { message: `The extenison : x-ms-code-generation-settings was deprecated. Consider remove it from the swagger`, location: path };
    }
  }
});