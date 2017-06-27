/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const LicenseHeaderMustNotBeSpecified: string = "LicenseHeaderMustNotBeSpecified";

rules.push({
  id: "R2065",
  name: LicenseHeaderMustNotBeSpecified,
  severity: "warning",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm | OpenApiTypes.dataplane,
  appliesTo_JsonQuery: "$..info['x-ms-code-generation-settings']",
  run: function* (doc, node, path) {
    const msg: string = `License header must not be specified inside x-ms-code-generation-settings. This is different for different sdks generated and is passed via command line/config file when generating the sdk.`;
    if (node.header !== undefined) {
      yield { message: `${msg}`, location: path };
    }
  }
});