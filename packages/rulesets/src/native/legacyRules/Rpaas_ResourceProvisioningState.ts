/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from "@microsoft.azure/openapi-validator-core"
import { ArmHelper } from "../utilities/armHelper"
import { JsonPath } from "@microsoft.azure/openapi-validator-core"
import { SwaggerHelper } from "../utilities/swaggerHelper"
export const Rpaas_ResourceProvisioningState = "Rpaas_ResourceProvisioningState"

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
    const utils = new ArmHelper(doc, ctx?.specPath, ctx?.inventory)
    const swaggerUtil = new SwaggerHelper(doc,ctx?.specPath,ctx?.inventory)
    const allResources = utils.getAllResource()
    for (const resource of allResources) {
      const model = utils.getResourceByName(resource)
      const properties = swaggerUtil?.getPropertyOfModel(model, "properties")
      let hasProvisioningState = false
      if (properties && (!properties.type || properties.type === "object")) {
        if (swaggerUtil?.getPropertyOfModel(properties, "provisioningState")) {
          hasProvisioningState = true
        }
      }
      if (!hasProvisioningState) {
        yield { message: msg.replace("{0}", resource), location: ["$", "definitions", resource] as JsonPath }
      }
    }
  }
})
