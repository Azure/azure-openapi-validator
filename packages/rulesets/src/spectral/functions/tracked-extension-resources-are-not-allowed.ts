import { isPathOfExtensionResource, getProperty, getProperties } from "./utils"

export const trackedExtensionResourcesAreNotAllowed = (apiPath: any, _opts: any, ctx: any) => {
  if (apiPath === null || typeof apiPath !== "object") {
    return []
  }


  const responseCodes = ["200", "201", "202"]
  const verbs = ["put", "patch", "post", "delete", "get"]
  const path = ctx.path || []
  const errors = []

  if (isPathOfExtensionResource(apiPath)){
    errors.push({
      message: `response schema in long running PUT operation is missing ProvisioningState property. A LRO PUT operations response schema must have ProvisioningState specified for the 200 and 201 status codes.`,
      path,
    })

  }
  
    // for (const code of putCodes) {
    //   const allProperties = getProperties(putOp.responses[code]?.schema)
    //   const provisioningStateProperty = getProperty(allProperties?.properties, "provisioningState")
    //   if (provisioningStateProperty === undefined || Object.keys(provisioningStateProperty).length === 0) {
    //     errors.push({
    //       message: `${code} response schema in long running PUT operation is missing ProvisioningState property. A LRO PUT operations response schema must have ProvisioningState specified for the 200 and 201 status codes.`,
    //       path,
    //     })
    //   }
    // }

  return errors
}
