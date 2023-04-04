export const DeleteResponseCodes = (deleteOp: any, _opts: any, ctx: any) => {
  if (deleteOp === null || typeof deleteOp !== "object") {
    return []
  }
  const path = ctx.path
  const errors = []

  if (!deleteOp?.responses) {
    return []
  }

  if (deleteOp["x-ms-long-running-operation"] && deleteOp["x-ms-long-running-operation"] === true) {
    if (!deleteOp.responses["202"] || !deleteOp.responses["204"]) {
      errors.push({
        message: "LRO DELETE must have 202 and 204 return code.",
        path: path,
      })
    }
  } else {
    if (!deleteOp.responses["200"] || !deleteOp.responses["204"]) {
      errors.push({
        message: "Synchronous DELETE must have 200 and 204 return code.",
        path: path,
      })
    }
  }

  return errors
}
