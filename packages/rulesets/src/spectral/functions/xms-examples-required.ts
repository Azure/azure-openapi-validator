// Verifies whether `x-ms-examples` are provided for each operation or not.
const xmsExamplesRequired = (swaggerObj: any, _opts: any, paths: any) => {
  if (swaggerObj === null || typeof swaggerObj !== "object") {
    return []
  }
  if (swaggerObj["x-ms-examples"] !== undefined && Object.keys(swaggerObj["x-ms-examples"].length > 0)) return []
  const path = paths.path || []
  return [
    {
      message: `Please provide x-ms-examples describing minimum/maximum property set for response/request payloads for operations.`,
      path: path,
    },
  ]
}

export default xmsExamplesRequired
