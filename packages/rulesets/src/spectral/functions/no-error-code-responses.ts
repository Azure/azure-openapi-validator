// NoErrorCodeResponses
// We want all errors to be surfaced using the “default” option.
// So the only valid options in the status codes should be the ones for success [200, 201, 202, 204] and “default”.
// RPC Code: <not yet coded>

// Any response codes that are not in this array will be flagged
const ALLOWED_RESPONSE_CODES = ["200", "201", "202", "204", "default"]

export const noErrorCodeResponses = (responseCode: any, _opts: any, ctx: any) => {
  if (!responseCode || typeof responseCode !== "string") {
    return []
  }

  // no error if the response code matches any of the allowed response codes
  if (ALLOWED_RESPONSE_CODES.some((allowedCode) => responseCode === allowedCode)) {
    return []
  }

  // response code did not match any of the allowed codes, so error
  return [
    {
      message: "",
      path: ctx.path ?? [],
    },
  ]
}
