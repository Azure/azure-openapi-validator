// Synchronous POST must have 200 & 204 return codes and LRO POST must have 200 & 202 return codes.
// RPC Code: RPC-Async-V1-11

const SYNC_POST_RESPONSES_OK = ["200", "default"]
const SYNC_POST_RESPONSES_NO_CONTENT = ["204", "default"]
const LR_POST_RESPONSES_WITH_FINAL_SCHEMA = ["200", "202", "default"]
const LR_POST_RESPONSES_NO_FINAL_SCHEMA = ["202", "default"]

const SYNC_ERROR =
  "Synchronous POST operations must have one of the following combinations of responses - 200 and default ; 204 and default. They also must not have other response codes."
const LR_ERROR =
  "Long-running POST operations must have responses with 202 and default return codes. They must also have a 200 return code if only if the final response is intended to have a schema, if not the 200 return code must not be specified. They also must not have other response codes."
const LR_NO_SCHEMA_ERROR = "200 return code does not have a schema specified. LRO POST must have a 200 return code if only if the final response is intended to have a schema, if not the 200 return code must not be specified."
const EmptyResponse_ERROR =
  "POST operation response codes must be non-empty. Synchronous POST operation must have response codes 200 and default or 204 and default. LRO POST operations must have response codes 202 and default. They must also have a 200 return code if only if the final response is intended to have a schema, if not the 200 return code must not be specified."

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
    let wrongResponseCodes = false
    let okResponseCodeNoSchema = false

    if (!postOp["x-ms-long-running-operation"] || postOp["x-ms-long-running-operation"] !== true) {
      errors.push({
        message: "An async POST operation must set '\"x-ms-long-running-operation\" : true'.",
        path: path,
      })
      return errors
    }

    if (responses.length === LR_POST_RESPONSES_WITH_FINAL_SCHEMA.length) {
      if (!LR_POST_RESPONSES_WITH_FINAL_SCHEMA.every((value) => responses.includes(value))) {
        wrongResponseCodes = true
      }else if(!postOp.responses["200"]?.schema){
        okResponseCodeNoSchema = true
      }
    }else if (responses.length !== LR_POST_RESPONSES_NO_FINAL_SCHEMA.length || !LR_POST_RESPONSES_NO_FINAL_SCHEMA.every((value) => responses.includes(value))) {
      wrongResponseCodes = true
    }

    if (wrongResponseCodes) {
      errors.push({
        message: LR_ERROR,
        path: path,
      })
    }else if(okResponseCodeNoSchema){
       errors.push({
         message: LR_NO_SCHEMA_ERROR,
         path: path,
       })
    }

    return errors
  } else {
    if (
      responses.length !== SYNC_POST_RESPONSES_OK.length ||
      (!SYNC_POST_RESPONSES_OK.every((value) => responses.includes(value)) &&
      !SYNC_POST_RESPONSES_NO_CONTENT.every((value) => responses.includes(value)))
    ) {
      errors.push({
        message: SYNC_ERROR,
        path: path,
      })
    }
  }

  return errors
}
