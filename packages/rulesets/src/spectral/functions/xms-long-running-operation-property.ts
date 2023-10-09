// RPC Code: RPC-Async-V1-15

const errorMessage =
  "If an operation's (PUT/POST/PATCH/DELETE) responses have `Location` or `Azure-AsyncOperation` headers then it MUST have the property `x-ms-long-running-operation` set to `true`"
const responsesCodes = ["200", "201", "202", "204"]

const verifyXMSLongRunningOperationProperty = (pathItem: any, _opts: any, paths: any) => {
  if (pathItem === null || typeof pathItem !== "object" || pathItem["x-ms-long-running-operation"] === true) {
    return []
  }
  const path = paths.path || []

  for (const code of responsesCodes) {
    const headers = pathItem.responses[code]?.headers
    if (headers) {
      for (const headerValue of Object.keys(headers)) {
        if (headerValue.toLowerCase() === "location" || headerValue.toLowerCase() === "azure-asyncoperation") {
          return [
            {
              message: errorMessage,
              path: path.concat(["responses", code, "headers", headerValue]),
            },
          ]
        }
      }
    }
  }
  return
}
export default verifyXMSLongRunningOperationProperty
