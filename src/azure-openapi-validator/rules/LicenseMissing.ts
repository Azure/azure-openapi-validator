/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const LicenseMissing: string = "LicenseMissing";

rules.push({
  id: "R2065",
  name: LicenseMissing,
  severity: "error",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$..info",
  run: function* (doc, node, path) {

    const acceptableLicenseValue: string = 'MICROSOFT_MIT_NO_VERSION';
    const msg: string = `Please provide correct licensing information here. Acceptable value: "name": "${acceptableLicenseValue}"`;
    // check if a license is provided, if not raise hell!
    if (node.license === undefined) {
      yield { message: `${msg}`, location: path };
    }
    // check the name property of license object
    else if (node.license.name !== acceptableLicenseValue) {
      yield { message: `${msg}`, location: path };
    }
  }
});