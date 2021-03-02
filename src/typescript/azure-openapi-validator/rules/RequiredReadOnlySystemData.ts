/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { nodes, stringify } from "jsonpath"
import { MergeStates, OpenApiTypes, rules } from "../rule"
import { ResourceUtils } from "./utilities/resourceUtils"
export const RequiredReadOnlySystemData: string = "RequiredReadOnlySystemData"

rules.push({
  id: "R4009",
  name: RequiredReadOnlySystemData,
  severity: "error",
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
      const utils = new ResourceUtils(doc)
      const allResources = utils.getAllResourceNames()
      /*
       * need to check get, put and patch actions
       */
      for (const value of ["get", "put", "patch"]) {
        for (const responses of nodes(doc, `$.paths.*.${value}.responses`)) {
          let hasSystemData = true
          let isReadOnly = true
          for (const key of Object.keys(responses.value)) {
            // check code 200,201,202,203...
            if (key.startsWith("20")) {
              const response = responses.value[key]
              const toValidateSchema = response.schema
              if (!toValidateSchema || !toValidateSchema.$ref) {
                continue
              }
              const toValidateModelName = utils.stripDefinitionPath(toValidateSchema.$ref)
              // Needs to check if it's a resource first.
              if (allResources.includes(toValidateModelName)) {
                const systemData = utils.getPropertyOfModelName(toValidateModelName, "systemData")
                if (!systemData) {
                  hasSystemData = false
                  break
                }
                if (!systemData.readOnly) {
                  isReadOnly = false
                  break
                }
              }
            }
          }
          if (!hasSystemData) {
            // operationId is located in the parent object of responses
            const operationId = nodes(doc, stringify(responses.path.slice(0, -1)))[0].value.operationId
            yield {
              message: `The response of operation:'${operationId}' is defined without 'systemData'. Consider adding the systemData to the response.`,
              location: responses.path.slice(0, -1)
            }
          }
          if (!isReadOnly) {
            const operationId = nodes(doc, stringify(responses.path.slice(0, -1)))[0].value.operationId
            yield {
              message: `The property systemData in the response of operation:'${operationId}' is not read only. Please add the readonly for the systemData.`,
              location: responses.path.slice(0, -1)
            }
          }
        }
      }
    }
  }
})
