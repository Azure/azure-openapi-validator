/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const LicenseMissing: string = "LicenseMissing";

rules.push({
  id: "R2006",
  name: LicenseMissing,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$..info",
  run: function* (doc, node, path) {
    const acceptableLicenseValue: string = 'MICROSOFT_MIT_NO_VERSION';
    // check if a license is provided or whether license value provided is correct, if not raise hell!
    if (node.license !== acceptableLicenseValue) {
      yield { message: `Please provide correct licensing information here. Acceptable value: ${acceptableLicenseValue}`, location: path };
    }
  }
});