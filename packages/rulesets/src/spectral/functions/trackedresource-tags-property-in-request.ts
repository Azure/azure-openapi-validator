import { getProperties, getRequiredProperties } from "./utils";

// Check that the body parameter for put operation includes a top level property for tags when its a tracked resource and that it is specified as an optional property.
// The code assumes it is running on a resolved doc
const trackedResourceTagsPropertyInRequest = (pathItem: any, _opts: any, paths: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }
  const path = paths.path || []

  const errors: any[] = []

  const pathParams = pathItem.parameters || []

  if (pathItem["put"] && Array.isArray(pathItem["put"].parameters)) {
    const allParams = [...pathParams, ...pathItem["put"].parameters]
    const bodyParam = allParams.find((p: any) => p.in === "body")
    if (bodyParam) {
      const properties = getProperties(bodyParam.schema)
      const requiredProperties = getRequiredProperties(bodyParam.schema)      
      if ("location" in properties) {
        if ("tags" in properties) {
          if (requiredProperties.includes("tags")) {
            errors.push({
              message: `Tags must not be a required property.`,
              path: [...path,"put"]
            })
          }
        }
        else {
          errors.push({
            message: `Tracked resource does not have tags in the request schema.`,
            path: [...path, "put"],
          })
        }
      }
    }
  }
  return errors
}

export default trackedResourceTagsPropertyInRequest
