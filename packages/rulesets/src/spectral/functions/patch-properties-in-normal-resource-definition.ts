import { getProperties } from "./utils"

export const PatchPropertiesInNormalResourceDefinition = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }

  const path = ctx.path
  const errors: any = []
  const patchProperties = []
  const putProperties = []
  const patchResponses = pathItem["patch"].responses


  for (const res in patchResponses) {
    const value = patchResponses[res]
    const properties = getProperties(value.schema)
    if (Object.entries(properties).length > 0) {
      patchProperties.push(properties)
    }
  }

  if (patchProperties.length === 0) {
    return []
  }

  if (!pathItem["put"]) {
    errors.push({
      message:
        "Patch request body MUST contain at least one or more properties present in the normal resource definition (PUT operation).",
      path: path,
    })
    return errors
  }

  const putResponses = pathItem["put"].responses
  for (const res in putResponses) {
    const value = putResponses[res]
    const properties = getProperties(value.schema)
    if (Object.entries(properties).length > 0) {
      putProperties.push(properties)
    }
  }

  const patchPropertiesSet = new Set()
  const putPropertiesSet = new Set()
  for (const patchProp of patchProperties) {
    patchPropertiesSet.add(JSON.stringify(patchProp))
  }

  for (const putProp of putProperties) {
    putPropertiesSet.add(JSON.stringify(putProp))
  }

  for (const patchProp of patchPropertiesSet) {
    if (putPropertiesSet.has(patchProp)) {
      return []
    }
  }

  errors.push({
    message: "Patch request body MUST contain at least one or more properties present in the normal resource definition (PUT operation).",
    path: path,
  })

  return errors
}
