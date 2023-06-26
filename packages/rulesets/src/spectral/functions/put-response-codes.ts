// Synchronous and LR PUT must have 200 & 201 return codes.
// RPC Code: RPC-Async-V1-01

const LR_AND_SYNC_RESPONSES = ["200", "201", "default"]
const LR_AND_SYNC_ERROR =
  "Synchronous and Long-running PUT operations must have responses with 200, 201 and default return codes. They also must not have other response codes."
const EmptyResponse_ERROR =
  "PUT operation response codes must be non-empty. It must have response codes 200, 201 and default for both synchronous and long running."

export const PutResponseCodes = (putOp: any, _opts: any, ctx: any) => {
  if (putOp === null || typeof putOp !== "object") {
    return []
  }
  const path = ctx.path
  const errors = []

  const responses = Object.keys(putOp?.responses ?? {})

  if (responses.length == 0) {
    errors.push({
      message: EmptyResponse_ERROR,
      path: path,
    })
    return errors
  }

  const isAsyncOperation = (putOp["x-ms-long-running-operation"] && putOp["x-ms-long-running-operation"] === true) || !! putOp["x-ms-long-running-operation-options"]

  if (isAsyncOperation) {
    if (!putOp["x-ms-long-running-operation"]) {
      errors.push({
        message: "An async PUT operation must set '\"x-ms-long-running-operation\" : true'.",
        path: path,
      })
      return errors
    }
  }

  if (responses.length !== LR_AND_SYNC_RESPONSES.length || !LR_AND_SYNC_RESPONSES.every((value) => responses.includes(value))) {
    errors.push({
      message: LR_AND_SYNC_ERROR,
      path: path,
    })
  }
  

  return errors
}
