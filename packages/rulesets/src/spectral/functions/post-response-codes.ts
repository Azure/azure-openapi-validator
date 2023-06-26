// Synchronous POST must have 200 & 204 return codes and LRO POST must have 200 & 202 return codes.
// RPC Code: RPC-Asyn-V1-11

const SYNC_POST_RESPONSES = ["200", "204", "default"]
const LR_POST_RESPONSES = ["200", "202", "default"]
const SYNC_ERROR =
  "Synchronous POST operations must have responses with 200, 204 and default return codes. They also must not have other response codes."
const LR_ERROR =
  "Long-running POST operations must have responses with 200, 202 and default return codes. They also must not have other response codes."
const EmptyResponse_ERROR =
  "POST operation response codes must be non-empty. It must have response codes 200, 204 and default if it is sync or 200, 202 and default if it is long running."

export const PostResponseCodes = (postOp: any, _opts: any, ctx: any) => {
  if (postOp === null || typeof postOp !== "object") {
    return []
  }
  const path = ctx.path
  const errors = []

  const responses = Object.keys(postOp?.responses ?? {})

  if (responses.length == 0) {
    errors.push({
      message: EmptyResponse_ERROR,
      path: path,
    })
    return errors
  }

  const isAsyncOperation =
    postOp.responses["202"] ||
    (postOp["x-ms-long-running-operation"] && postOp["x-ms-long-running-operation"] === true) ||
    postOp["x-ms-long-running-operation-options"]

  if (isAsyncOperation) {
    if (!postOp["x-ms-long-running-operation"] || postOp["x-ms-long-running-operation"] !== true) {
      errors.push({
        message: "An async POST operation must set '\"x-ms-long-running-operation\" : true'.",
        path: path,
      })
      return errors
    }

    if (!postOp["x-ms-long-running-operation-options"]) {
      errors.push({
        message: "An async POST operation must set long running operation options 'x-ms-long-running-operation-options'.",
        path: path,
      })
      return errors
    }

    if (
      postOp["x-ms-long-running-operation-options"] &&
      (!postOp["x-ms-long-running-operation-options"]["final-state-via"] ||
        postOp["x-ms-long-running-operation-options"]["final-state-via"] != "location")
    ) {
      errors.push({
        message:
          "An async POST operation is tracked via Azure-AsyncOperation header. Set 'final-state-via' property to 'location' in 'x-ms-long-running-operation-options.",
        path: path,
      })
      return errors
    }

    if (responses.length !== LR_POST_RESPONSES.length || !LR_POST_RESPONSES.every((value) => responses.includes(value))) {
      errors.push({
        message: LR_ERROR,
        path: path,
      })
    }
  } else {
    if (responses.length !== SYNC_POST_RESPONSES.length || !SYNC_POST_RESPONSES.every((value) => responses.includes(value))) {
      errors.push({
        message: SYNC_ERROR,
        path: path,
      })
    }
  }

  return errors
}
