export const LROPostFinalStateViaProperty = (postOp: any, _opts: any, ctx: any) => {
  if (postOp === null || typeof postOp !== "object") {
    return []
  }
  const path = ctx.path
  const errors = []

  if (!postOp["x-ms-long-running-operation-options"]) {
    errors.push({
      message:
        "A LRO POST MUST have long-running-operation-options specified and MUST have location header in the final-state-via property.",
      path: path,
    })
    return errors
  }
  const finalStateViaProperty = postOp["x-ms-long-running-operation-options"]["final-state-via"]

  if (!finalStateViaProperty || finalStateViaProperty !== "location") {
    errors.push({
      message:
        "A LRO POST MUST have long-running-operation-options specified and MUST have location header in the final-state-via property.",
      path: path,
    })
  }

  return errors
}
