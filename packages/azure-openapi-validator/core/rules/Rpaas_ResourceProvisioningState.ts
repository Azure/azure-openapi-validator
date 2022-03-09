/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "../types"
import { ArmUtils } from "./utilities/ArmUtils"
import { JsonPath } from "../types"
export const Rpaas_ResourceProvisioningState: string = "Rpaas_ResourceProvisioningState"

rules.push({
  id: "R4031",
  name: Rpaas_ResourceProvisioningState,
  severity: "error",
  category: "RPaaSViolation",
  mergeState: MergeStates.individual,
  openapiType: OpenApiTypes.rpaas,
  appliesTo_JsonQuery: "$",
  *run(doc, node, path, ctx) {
    const msg = `[RPaaS] The resource {0} is defined without 'provisioningState' in properties bag, consider adding the provisioningState for it.`
    const utils = new ArmUtils(doc, ctx.specPath, ctx.graph)
    const swaggerUtil = ctx.utils
    const allResources = utils.getAllResource()
    for (const resource of allResources) {
      const model = utils.getResourceByName(resource)
      const properties = swaggerUtil.getPropertyOfModel(model, "properties")
      let hasProvisioningState = false
      if (properties && (!properties.type || properties.type === "object")) {
        if (swaggerUtil.getPropertyOfModel(properties, "provisioningState")) {
          hasProvisioningState = true
        }
      }
      if (!hasProvisioningState) {
        yield { message: msg.replace("{0}", resource), location: ["$", "definitions", resource] as JsonPath }
      }
    }
  }
})
