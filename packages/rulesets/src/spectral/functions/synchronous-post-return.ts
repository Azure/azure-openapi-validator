export const SyncPostReturn = (postOp: any, _opts: any, ctx: any) => {
  if (postOp === null || typeof postOp !== "object") {
    return []
  }

  if (postOp["x-ms-long-running-operation"] && postOp["x-ms-long-running-operation"] === true) {
    return []
  }

  const path = ctx.path || []
  const errors: any = []
  const responses = postOp.responses
  if (responses && (!(responses["200"] || responses["204"]) || !!(responses["200"] && responses["204"]))) {
    errors.push({
      message: "A synchronous POST operation must have either 200 or 204 return codes.",
      path: path,
    })
  }

  if (responses["200"] && !responses["200"].schema) {
    errors.push({
      message:
        "200 response for a synchronous POST operation must have a response schema specified.",
      path,
    })
  }

  if (responses["204"] && responses["204"].schema) {
    errors.push({
      message:
        "204 response for a synchronous POST operation must not have a response schema specified.",
      path,
    })
  }

  return errors
}
