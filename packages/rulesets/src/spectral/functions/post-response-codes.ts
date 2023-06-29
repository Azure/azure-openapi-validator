// Synchronous POST must have 200 & 204 return codes and LRO POST must have 200 & 202 return codes.
// RPC Code: RPC-Async-V1-11
import _ from "lodash"

const SYNC_POST_RESPONSES_CASE1 = ["200", "default"]
const SYNC_POST_RESPONSES_CASE2 = ["204", "default"]
const LR_POST_RESPONSES_CASE1 = ["200", "202", "default"]
const LR_POST_RESPONSES_CASE2 = ["202", "default"]
const SYNC_ERROR =
  "Synchronous POST operations must have responses with 200, default or  204, default return codes. They also must not have other response codes."
const LR_ERROR =
  "Long-running POST operations must have responses with 202, default return codes and should also have a 200 return code only if the final response is intended to have a schema, if not the 200 return code must not be specified. They also must not have other response codes."
const EmptyResponse_ERROR =
  "POST operation response codes must be non-empty. It must have response codes 200, default or 204, default if it is synchronous and 200 with a non-empty schema, 202 and default if it is long running."

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

    if (responses.length === LR_POST_RESPONSES_CASE1.length) {
      if (!LR_POST_RESPONSES_CASE1.every((value) => responses.includes(value)) || !postOp.responses["200"]?.schema) {
        errors.push({
          message: LR_ERROR,
          path: path,
        })
        return errors
      }
      return 
    } 
    
    if (responses.length !== LR_POST_RESPONSES_CASE2.length || !LR_POST_RESPONSES_CASE2.every((value) => responses.includes(value))) {
      errors.push({
        message: LR_ERROR,
        path: path,
      })
      return errors
    }
  } else {
      if (
        responses.length !== SYNC_POST_RESPONSES_CASE1.length ||
        (!SYNC_POST_RESPONSES_CASE1.every((value) => responses.includes(value)) &&
        !SYNC_POST_RESPONSES_CASE2.every((value) => responses.includes(value)))
      ) {
        errors.push({
          message: SYNC_ERROR,
          path: path,
        })
      }
  }

  return errors
}
