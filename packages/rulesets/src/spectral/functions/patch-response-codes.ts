// Synchronous PATCH must have 200 return code and LRO PATCH must have 200 & 202 return codes.
// RPC Code: RPC-Asyn-V1-11

const SYNC_PATCH_RESPONSES = ["200", "default"]
const LR_PATCH_RESPONSES = ["200", "202", "default"]
const SYNC_ERROR =
  "Synchronous PATCH operations must have responses with 200 and default return codes. They also must not have other response codes."
const LR_ERROR =
  "Long-running PATCH operations must have responses with 200, 202 and default return codes. They also must not have other response codes."
const EmptyResponse_ERROR =
  "PATCH operation response codes must be non-empty. It must have response codes 200 and default if it is sync or 200, 202 and default if it is long running."

export const patchResponseCodes = (patchOp: any, _opts: any, ctx: any) => {
  if (patchOp === null || typeof patchOp !== "object") {
    return []
  }
  const path = ctx.path
  const errors = []

  const responses = Object.keys(patchOp?.responses ?? {})

  if (responses.length == 0) {
    errors.push({
      message: EmptyResponse_ERROR,
      path: path,
    })
    return errors
  }

  const isAsyncOperation =
    (patchOp["x-ms-long-running-operation"] && patchOp["x-ms-long-running-operation"] === true) ||
    patchOp["x-ms-long-running-operation-options"]

  if (isAsyncOperation) {
    if (!patchOp["x-ms-long-running-operation"] || patchOp["x-ms-long-running-operation"] !== true) {
      errors.push({
        message: "An async PATCH operation must set '\"x-ms-long-running-operation\" : true'.",
        path: path,
      })
      return errors
    }

    if (responses.length !== LR_PATCH_RESPONSES.length || !LR_PATCH_RESPONSES.every((value) => responses.includes(value))) {
      errors.push({
        message: LR_ERROR,
        path: path,
      })
    }

    if (patchOp.responses["202"]?.schema) {
      errors.push({
        message: "202 response for a LRO PATCH operation must not have a response schema specified.",
        path: path,
      })
    }
  } else {
    if (responses.length !== SYNC_PATCH_RESPONSES.length || !SYNC_PATCH_RESPONSES.every((value) => responses.includes(value))) {
      errors.push({
        message: SYNC_ERROR,
        path: path,
      })
    }
  }

  return errors
}
