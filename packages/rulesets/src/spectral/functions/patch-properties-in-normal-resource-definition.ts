import { getProperties } from "./utils"

export const PatchPropertiesInNormalResourceDefinition = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }

  const path = ctx.path
  const errors: any = []

  if (!pathItem["put"]) {
    errors.push({
      message: "Patch request body MUST contain atleast one or more properties present in the normal resource definition(PUT operation).",
      path: path,
    })
    return errors
  }

  const patchProperties = []
  const putProperties = []

  const patchResponses = pathItem["patch"].responses
  const putResponses = pathItem["put"].responses

  for (const res in patchResponses) {
    const value = patchResponses[res]
    patchProperties.push(getProperties(value.schema))
  }

  for (const res in putResponses) {
    const value = putResponses[res]
    putProperties.push(getProperties(value.schema))
  }

  for (const patchProp of patchProperties) {
    for (const putProp of putProperties) {
      if (JSON.stringify(putProp) === JSON.stringify(patchProp)) {
        return []
      }
    }
  }
  // if (putProperties.includes(patchProp)) {
  //   return []
  // }

  errors.push({
    message: "Patch request body MUST contain atleast one or more properties present in the normal resource definition(PUT operation).",
    path: path,
  })

  return errors
}
