/**
 * verify if a LRO put operation has 201 response code.
 */

export const lroPutReturn = (putOp: any, _opts: any, ctx: any) => {
  if (putOp === null || typeof putOp !== "object") {
    return []
  }
  const path = ctx.path || []
  if (!putOp["x-ms-long-running-operation"]) {
    return []
  }
  const errors: any = []
  if (putOp?.responses && !(putOp?.responses["201"] && putOp?.responses["200"])) {
    errors.push({
      message: "The async put operation must have both 200 and 201 response code.",
      path: [...path, "responses"],
    })
  }
  return errors
}
