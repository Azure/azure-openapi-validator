// Check that the body parameter for put operation does not include the properties which present in URI.

import { getProperties } from "./utils"

// targetVal should be a [path item object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#pathItemObject).
// The code assumes it is running on a resolved doc
const bodyParamRepeatedInfo = (pathItem: any, _opts: any, paths: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }
  const path = paths.path || []

  const errors: any[] = []

  const pathParams = pathItem.parameters || []

  if (pathItem["put"] && Array.isArray(pathItem["put"].parameters)) {
    const allParams = [...pathParams, ...pathItem["put"].parameters]
    const pathAndQueryParameters = allParams.filter((p: any) => p.in === "path" || p.in === "query").map((p: any) => p.name)
    const bodyParam = allParams.find((p: any) => p.in === "body")
    if (bodyParam) {
      const properties = getProperties(bodyParam.schema)
      if ("properties" in properties) {
        const propertiesProperties = getProperties(properties.properties)
        for (const prop of Object.keys(propertiesProperties)) {
          if (pathAndQueryParameters.includes(prop)) {
            errors.push({
              message: ``,
              path: [...path, "put", "parameters", pathItem["put"].parameters.findIndex((p: any) => p.name === prop)],
            })
          }
        }
      }
    }
  }
  return errors
}

export default bodyParamRepeatedInfo
