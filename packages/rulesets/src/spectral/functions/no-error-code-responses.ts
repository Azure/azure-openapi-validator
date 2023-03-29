// NoErrorCodeResponses
// We want all errors to be surfaced using the “default” option.
// So the only valid options in the status codes should be the ones for success [200, 201, 202, 204] and “default”.
// RPC Code: <not yet coded>

const ALLOWED_RESPONSE_CODES = ["200", "201", "202", "204", "default"]

export const noErrorCodeResponses = (responseCode: any, _opts: any, ctx: any) => {
  if (!responseCode) {
    return []
  }

  if (ALLOWED_RESPONSE_CODES.some((allowedCode) => responseCode === allowedCode)) {
    return []
  }

  return [
    {
      message: "",
      path: ctx.path ?? [],
    },
  ]
}
