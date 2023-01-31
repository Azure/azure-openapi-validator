/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
export const PreviewVersionOverOneYear = "PreviewVersionOverOneYear"

rules.push({
  id: "R4024",
  name: PreviewVersionOverOneYear,
  severity: "warning",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.info",
  *run(doc, node, path) {
    const msg = `The API version:{0} having been in a preview state over one year , please move it to GA or retire.`
    if (node) {
      if (node.version && node.version.includes("preview")) {
        const apiVersion = node.version
        const matched = apiVersion.match(/\d{4}-\d{2}-\d{2}/g)

        const dateNow = new Date(Date.now())
        const oneYearAgo = new Date(dateNow.getFullYear() - 1, dateNow.getMonth(), dateNow.getDate()).toISOString().substr(0, 10)
        const apiVersionFormatted = matched && matched.length > 0 ? matched[0] : undefined
        if (!apiVersionFormatted || apiVersionFormatted > oneYearAgo) {
          return
        }
        yield { message: msg.replace("{0}", node.version), location: path.concat("version") }
      }
    }
  },
})
