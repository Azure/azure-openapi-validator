export const LROPostFinalStateViaProperty = (postOp: any, _opts: any, ctx: any) => {
  if (postOp === null || typeof postOp !== "object") {
    return []
  }
  const path = ctx.path
  const errors = []
  const errorMessage =
    "A long running operation (LRO) post MUST have 'long-running-operation-options' specified and MUST have the 'final-state-via' property set to 'azure-async-operation'."

  if (!postOp["x-ms-long-running-operation"] || postOp["x-ms-long-running-operation"] !== true) {
    return []
  }

  if (!postOp["x-ms-long-running-operation-options"]) {
    errors.push({
      message: errorMessage,
      path: path,
    })
    return errors
  }
  const finalStateViaProperty = postOp["x-ms-long-running-operation-options"]["final-state-via"]

  if (!finalStateViaProperty || finalStateViaProperty !== "azure-async-operation") {
    errors.push({
      message: errorMessage,
      path: path,
    })
  }

  return errors
}
