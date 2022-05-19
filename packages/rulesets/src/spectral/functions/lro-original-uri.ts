import { jsonPath } from "./utils"

// check the LRO which corresponds to the lroOptions must have a sibling get operation.
const validateOriginalUri = (lroOptions: any, opts: any, ctx: any) => {
  if (!lroOptions || typeof lroOptions !== "object") {
    return []
  }

  const path = ctx.path || []
  const messages: any[] = []
  const getOperationPath = [...path.slice(0, -2), "get"]
  if (!jsonPath(getOperationPath, ctx.document.parserResult.data)) {
    messages.push({
      path: [...path.slice(0, -1)],
      message: "",
    })
  }
  return messages
}

export default validateOriginalUri
