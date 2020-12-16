/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../rule"
import { ResourceUtils } from "./utilities/resourceUtils"
import { JsonPath } from "../../jsonrpc/types"
export const Rpaas_ResourceProvisioningState: string = "Rpaas_ResourceProvisioningState"

rules.push({
  id: "R4031",
  name: Rpaas_ResourceProvisioningState,
  severity: "error",
  category: "RPaaSViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.rpaas,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path) {
    const msg = `The resource {0} is defined with empty property bag, consider adding the provisioningState for it.`
    const utils = new ResourceUtils(doc)
    const allResources = utils.getAllResource()
    for (const resource of allResources) {
      const model = utils.getResourceByName(resource)
      const properties = utils.getPropertyOfModel(model,"properties")
      if (!properties.type || properties.type == "object") {
        if (!properties.additionalProperties && !properties.allOf && (!properties.properties || Object.keys(properties.properties).length === 0)) {
          yield {  message: msg.replace("{0}", resource),
          location: ["$", "definitions", resource] as JsonPath}
        }
      }
    }
  }
})
