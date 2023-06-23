// Check a sku model to ensure it must have a name property. It can also have 'tier', 'size', 'family', 'capacity' as optional properties.

import { RulesetFunctionContext } from "@stoplight/spectral-core"
import { getReturnedType } from "./utils"

const putGetPatchSchema: any = (pathItem: any, opts: any, ctx: RulesetFunctionContext) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }

  const neededHttpVerbs = ["put", "get", "patch"]

  const path = ctx.path || []
  const errors = []
  const models = new Set<string | null>()

  for (const verb of neededHttpVerbs) {
    if (pathItem[verb]) {
      models.add(getReturnedType(pathItem[verb]))
    }
    if (models.size > 1) {
      errors.push({
        message: "",
        path,
      })
      break
    }
  }
  return errors
}

export default putGetPatchSchema
