// Verifies that GET has 200 response code defined. Also, checks if there is any additional response code defined it is 202 and nothing else

const GET_RESPONSES = ["200", "202", "default"]
const GET_RESPONSE_ERROR =
  "GET operation must have response codes 200 and default. In addition, can have 202 if the GET represents the location header polling url."
const EmptyResponse_ERROR =
  "GET operation response codes must be non-empty. It must have response codes 200 and default. In addition, can have 202 if the GET represents the location header polling url."

export const getResponseCodes = (getOp: any, _opts: any, ctx: any) => {
  if (getOp === null || typeof getOp !== "object") {
    return []
  }
  const path = ctx.path
  const errors = []

  const responses = Object.keys(getOp?.responses ?? {})

  if (responses.length == 0) {
    errors.push({
      message: EmptyResponse_ERROR,
      path: path,
    })
    return errors
  }

  // flag error if 200 is not defined
  if (!responses.includes("200")) {
    errors.push({
      message: GET_RESPONSE_ERROR,
      path: path,
    })
    return errors
  }

  // check if the responses defined are the accepted ones only
  if (!responses.every((response) => GET_RESPONSES.includes(response))) {
    errors.push({
      message: GET_RESPONSE_ERROR,
      path: path,
    })
  }

  return errors
}
