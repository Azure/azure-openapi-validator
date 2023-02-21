export const PatchResponseCode = (patchOp: any, _opts: any, ctx: any) => {
  if (patchOp === null || typeof patchOp !== "object") {
    return []
  }
  const path = ctx.path
  const errors = []

  if (patchOp["x-ms-long-running-operation"] && patchOp["x-ms-long-running-operation"] == true) {
    if (patchOp?.responses && !(patchOp?.responses["200"] && patchOp?.responses["202"])) {
      errors.push({
        message: "LRO PATCH must have 200 and 202 return code.",
        path: path,
      })
    }
  } else {
    if (patchOp?.responses && !patchOp?.responses["200"]) {
      errors.push({
        message: "Synchronous PATCH must have 200 return code.",
        path: path,
      })
    }
  }

  return errors
}
