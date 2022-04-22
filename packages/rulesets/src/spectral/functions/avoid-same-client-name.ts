//The x-ms-client-name extension is used to change the name of a parameter or property in the generated code. By using the 'x-ms-client-name' extension, a name can be defined for use specifically in code generation, separately from the name on the wire. It can be used for query parameters and header parameters, as well as properties of schemas. This name is case sensitive.

const avoidSameClientName = (swaggerObj: any, _opts: any, paths: any) => {
  if (swaggerObj === null || typeof swaggerObj !== "object") {
    return []
  }
  const path = paths.path || paths.target || []
  if (path[0] === "definitions") {
    //for Models
    if (swaggerObj["x-ms-client-name"] === undefined) return []
    else if (path[path.length - 1] === swaggerObj["x-ms-client-name"]) {
      return [
        {
          message: "Value of 'x-ms-client-name' cannot be the same as Property/Model",
          path,
        },
      ]
    }
  } else {
    //for Operations
    if (swaggerObj["name"] === undefined || swaggerObj["x-ms-client-name"] === undefined) return []
    else if (swaggerObj["name"] === swaggerObj["x-ms-client-name"])
      return [
        {
          message: "Value of 'x-ms-client-name' cannot be the same as Property/Model",
          path,
        },
      ]
  }
  return []
}

export default avoidSameClientName
