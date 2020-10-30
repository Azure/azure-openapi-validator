/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { nodes, stringify } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "../rule"
import { getResolvedJson, getResolvedResponseSchema, getResponseSchema } from "./utilities/rules-helper"
export const RequiredSystemDataInNewApiVersions: string = "RequiredSystemDataInNewApiVersions"

rules.push({
  id: "R4009",
  name: RequiredSystemDataInNewApiVersions,
  severity: "warning",
  category: "ARMViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.arm,
  appliesTo_JsonQuery: "",
  async *asyncRun(doc, node, path) {
    if (doc.info && doc.info.version) {
      const apiVersion = doc.info.version
      const matched = apiVersion.match(/\d{4}\-\d{2}\-\d{2}/g)
      const apiVersionFormated = matched && matched.length > 0 ? matched[0] : undefined
      if (!apiVersionFormated || apiVersionFormated < "2020-05-01") {
        // not a new Api Version
        return
      }
      const resolvedDoc = await getResolvedJson(doc)
      // have some swagger problem , just return
      if (!resolvedDoc) {
        return
      }
      /*
       * need to check get, put and patch actions
       */
      for (const value of ["get", "put", "patch"]) {
        for (const responses of nodes(resolvedDoc, `$.paths.*.${value}.responses`)) {
          let hasSystemData = false
          for (const key of Object.keys(responses.value)) {
            // check code 200,201,202,203...
            if (key.startsWith("20")) {
              const response = responses.value[key]
              const resolvedSchema = await getResolvedResponseSchema(response.schema)
              if (!resolvedSchema) {
                continue
              }
              const systemData = (resolvedSchema as any).systemData
              if (systemData && Object.keys(systemData)) {
                hasSystemData = true
              }
            }
          }
          if (!hasSystemData) {
            // operationId is located in the parent object of responses
            const operationId = nodes(resolvedDoc, stringify(responses.path.slice(0, -1)))[0].value.operationId
            yield {
              message: `The response of operation:'${operationId}' is defined without 'systemData'. Consider adding the systemData to the response.`,
              location: responses.path.slice(0, -1)
            }
          }
        }
      }
    }
  }
})
