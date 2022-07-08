export const lroPatch202 = (patchOp: any, _opts: any, ctx: any) => {
  if (patchOp === null || typeof patchOp !== "object") {
    return []
  }
  const path = ctx.path || []
  if (!patchOp["x-ms-long-running-operation"]) {
    return []
  }
  const errors: any = []
  if (patchOp?.responses && !patchOp?.responses["202"]) {
    errors.push({
      message: "The async patch operation should return 202.",
      path: [...path, "responses"],
    })
  }
  return errors
}
