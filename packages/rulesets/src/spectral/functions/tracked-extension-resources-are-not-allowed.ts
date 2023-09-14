import { isPathOfExtensionResource, getProperty, getProperties } from "./utils"

export const trackedExtensionResourcesAreNotAllowed = (apiPath: any, _opts: any, ctx: any) => {
  if (apiPath === null || typeof apiPath !== "string") {
    return []
  }

  const verbs = ["get", "put", "patch"]
  const responseCodes = ["200", "201", "202"]
  const path = ctx.path || []
  const errors = []

  // check if the apiPath is of type extensionResource
  if (isPathOfExtensionResource(apiPath)) {
    const operationPaths = ctx?.documentInventory?.resolved?.paths[apiPath]
    for (const verb of verbs) {
      if (operationPaths[verb]) {
        //check if location property exists in the response schema
        for (const responseCode of responseCodes) {
          const responseSchema = operationPaths[verb].responses[responseCode]?.schema
          if (responseSchema) {
            const allProperties = getProperties(responseSchema)
            const locationProperty = getProperty(allProperties, "location")
            if (locationProperty !== undefined) {
              errors.push({
                message: `${apiPath} is an extension resource and the response schema in ${verb} operation includes location property. Extension resources of type tracked are not allowed.`,
                path: [...path, verb, responseCode],
              })
            }
          }
        }
      }
    }
  }

  return errors
}
