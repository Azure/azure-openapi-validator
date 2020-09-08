/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule"
export const PreviewVersionOverOneYear: string = "PreviewVersionOverOneYear"

rules.push({
  id: "R4005",
  name: PreviewVersionOverOneYear,
  severity: "warning",
  category: "SDKViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "$.info",
  *run(doc, node, path) {
    const msg: string = `The swagger version:{0} has being published over one year , a preview version should GA in no more than one year.`
    if (node) {
      if (node.version && node.version.includes("preview")) {
        const apiVersion = node.version
        const matched = apiVersion.match(/\d{4}\-\d{2}\-\d{2}/g)

        const dateNow = new Date(Date.now())
        const oneYearAgo = new Date(dateNow.getFullYear() - 1, dateNow.getMonth(), dateNow.getDate()).toISOString().substr(0, 10)
        const apiVersionFormatted = matched && matched.length > 0 ? matched[0] : undefined
        if (!apiVersionFormatted || apiVersionFormatted > oneYearAgo) {
          return
        }
        yield { message: msg.replace("{0}", node.version), location: path.concat("version") }
      }
    }
  }
})
