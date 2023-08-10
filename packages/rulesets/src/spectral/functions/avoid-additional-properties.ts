import { getProperties } from "./utils"

const avoidAdditionalProperties = (pathItem: any, _opts: any, paths: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }
  const path = paths.path || []

  const errors: any[] = []

  // const pathParams = pathItem.parameters || []

  //if (pathItem["put,get,post,delete"] && Array.isArray(pathItem["put"].parameters)) {
  //const allParams = [...pathParams] //, ...pathItem["put"].parameters]
  // const bodyParam = allParams.find((p: any) => p.in === "body")
  //  if (bodyParam) {
  const properties = getProperties(pathItem)
  if ("location" in properties) {
    if ("tags" in properties) {
      return
    } else if ("additionalProperties" in properties) {
      errors.push({
        message: "The path must be under a subscription and resource group for tracked resource types.",
        path,
      })
    }
  } else if ("additionalProperties" in properties) {
    errors.push({
      message: "The path must be under a subscription and resource group for tracked resource types.",
      path,
    })
  }
  // }
  return errors
}
export default avoidAdditionalProperties
