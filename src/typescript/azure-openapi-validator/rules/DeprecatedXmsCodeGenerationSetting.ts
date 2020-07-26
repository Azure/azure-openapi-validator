/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule"
export const DeprecatedXmsCodeGenerationSetting: string = "DeprecatedXmsCodeGenerationSetting"
rules.push({
  id: "R4006",
  name: DeprecatedXmsCodeGenerationSetting,
  severity: "warning",
  category: "ARMViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,

  appliesTo_JsonQuery: '$.info["x-ms-code-generation-settings"]',
  *run(doc, node, path) {
    if (node) {
      yield {
        message: `The x-ms-code-generation-setting extension is being deprecated. Please remove it and move settings to readme file for code generation.`,
        location: path
      }
    }
  }
})
