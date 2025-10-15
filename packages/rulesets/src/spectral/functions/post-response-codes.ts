// Synchronous POST must have 200 & 204 return codes and LRO POST must have 202 & 200 or 202 & 204 or 202, 200 & 204 return codes.

const SYNC_POST_RESPONSES_OK = ["200", "default"]
const SYNC_POST_RESPONSES_NO_CONTENT = ["204", "default"]
const LR_POST_RESPONSES_OK = ["202", "200", "default"]
const LR_POST_RESPONSES_NO_CONTENT = ["202", "204", "default"]
const HTTP_STATUS_CODE_OK = "200"
const HTTP_STATUS_CODE_ACCEPTED = "202"
const HTTP_STATUS_CODE_NO_CONTENT = "204"

const SYNC_ERROR =
  "Synchronous POST operations must have one of the following combinations of responses - 200 and default ; 204 and default. No other response codes are permitted."
const LR_ERROR =
  "Long-running POST operations must initially return 202 with a default response and no schema. The final response must be 200 with a schema if one is required, or 204 with no schema if not. No other response codes are permitted."
const LR_NO_SCHEMA_ERROR_OK =
  "200 return code does not have a schema specified. LRO POST must have a 200 return code if only if the final response is intended to have a schema, if not the 200 return code must not be specified."
const LR_SCHEMA_ERROR_ACCEPTED = "202 response for a LRO POST operation must not have a response schema specified."
const LR_SCHEMA_ERROR_NO_CONTENT = "204 response for a Sync/LRO POST operation must not have a response schema specified."
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
    postOp.responses[HTTP_STATUS_CODE_ACCEPTED] ||
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

    const respSet = new Set(responses)
    const setEquals = (target: string[]) => target.length === respSet.size && target.every((v) => respSet.has(v))
    const matchesOk = setEquals(LR_POST_RESPONSES_OK)
    const matchesNoContent = setEquals(LR_POST_RESPONSES_NO_CONTENT)

    if (!(matchesOk || matchesNoContent)) {
      errors.push({
        message: LR_ERROR,
        path: path,
      })
    }
  } else {
    const responseSet = new Set(responses)
    const setEquals = (target: string[]) => target.length === responseSet.size && target.every((v) => responseSet.has(v))

    const matchesOk = setEquals(SYNC_POST_RESPONSES_OK)
    const matchesNoContent = setEquals(SYNC_POST_RESPONSES_NO_CONTENT)

    if (!(matchesOk || matchesNoContent)) {
      errors.push({
        message: SYNC_ERROR,
        path: path,
      })
    }
  }

  if (postOp.responses[HTTP_STATUS_CODE_OK] && !postOp.responses[HTTP_STATUS_CODE_OK]?.schema) {
    errors.push({
      message: LR_NO_SCHEMA_ERROR_OK,
      path: path,
    })
  }

  if (postOp.responses[HTTP_STATUS_CODE_ACCEPTED]?.schema) {
    errors.push({
      message: LR_SCHEMA_ERROR_ACCEPTED,
      path: path,
    })
  }

  if (postOp.responses[HTTP_STATUS_CODE_NO_CONTENT]?.schema) {
    errors.push({
      message: LR_SCHEMA_ERROR_NO_CONTENT,
      path: path,
    })
  }

  return errors
}
