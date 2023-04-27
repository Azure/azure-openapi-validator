import { getProperties } from "./utils"

export const patchPropertiesCorrespondToPutProperties = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }

  const error = [
    {
      message: "A patch request body must contain at least one of the properties present in the corresponding put request body.",
      path: ctx.path,
    },
  ]
  const patchResponses = pathItem["patch"]?.responses
  const putResponses = pathItem["put"]?.responses

  if (!patchResponses && !putResponses) {
    return []
  }
  if (patchResponses && !putResponses) {
    return error
  }

  // set of all the property names for successful patch responses
  const patchPropertyNames = new Set()
  // defined success response codes for the patch operation
  const patchResponseCodes = Object.keys(patchResponses).filter((statusCode) => statusCode.startsWith("2"))

  // add all the properties of patch responses to a set
  for (const responseStatusCode of patchResponseCodes) {
    const propertyNames = Object.keys(getProperties(patchResponses[responseStatusCode].schema))
    for (const name of propertyNames) {
      patchPropertyNames.add(name)
    }
  }

  if (patchPropertyNames.size < 1) {
    return []
  }

  // defined success response codes for the put operation
  const putResponseCodes = Object.keys(putResponses).filter((statusCode) => statusCode.startsWith("2"))
  for (const responseStatusCode of putResponseCodes) {
    const propertyNames = Object.keys(getProperties(putResponses[responseStatusCode].schema))
    if (propertyNames.some((name) => patchPropertyNames.has(name))) {
      return []
    }
  }

  return error
}
