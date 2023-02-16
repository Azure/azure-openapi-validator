export const lroPostReturn = (postOp: any, _opts: any, ctx: any) => {
  if (postOp === null || typeof postOp !== "object") {
    return []
  }

  const path = ctx.path || []
  const errors: any = []
  const responses = postOp.responses

  if (responses && (!responses["200"] || !responses["202"])) {
    errors.push({
      message: "A LRO POST operation must have both 200 & 202 return codes.",
      path: path,
    })
  }

  if (responses["200"] && !responses["200"].schema) {
    errors.push({
      message: "200 response for a LRO POST operation must have a response schema specified.",
      path,
    })
  }

  if (responses["202"] && responses["202"].schema) {
    errors.push({
      message: "202 response for a LRO POST operation must not have a response schema specified.",
      path,
    })
  }

  return errors
}
