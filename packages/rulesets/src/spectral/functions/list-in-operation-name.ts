// Verifies whether value for `operationId` is named as per ARM guidelines when response contains array of items.
const listInOperationName = (swaggerObj: any, _opts: any, paths: any) => {
  if (swaggerObj === null && typeof swaggerObj !== "object") {
    return []
  }
  const listRegex = /^((\w+_List\w*)|List)$/
  const path = paths.path
  if (swaggerObj["x-ms-pageable"] !== undefined) {
    if (!listRegex.test(swaggerObj.operationId)) {
      return [
        {
          message:
            "Since operation '${swaggerObj.operationId}' response has model definition 'x-ms-pageable', it should be of the form \\\"*_list*\\\". Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.",
          path: [...path, path[path.length - 1], "operationId"],
        },
      ]
    } else {
      return []
    }
  }
  if (swaggerObj.responses === undefined) return []
  const responseList = swaggerObj.responses
  let gotArray = false
  Object.values(responseList).some((response: any) => {
    if (response.schema) {
      if (response.schema.properties?.value?.type === "array" && Object.keys(response.schema.properties).length === 1) {
        if (!listRegex.test(swaggerObj["operationId"])) {
          gotArray = true
          return true
        }
      }
    }
    return false
  })
  if (gotArray)
    return [
      {
        message:
          "Since operation `${swaggerObj.operationId}` response has model definition 'array', it should be of the form \"_\\_list_\".",
        path: [...path, path[path.length - 1], "operationId"],
      },
    ]
  return []
}

export default listInOperationName
