// The `x-ms-client-name` extension is used to change the name of a parameter or property in the generated code.
// By using the 'x-ms-client-name' extension, a name can be defined for use specifically in code generation, separately from the name on the wire.
// It can be used for query parameters and header parameters, as well as properties of schemas. This name is case sensitive.
const xmsClientNameParameter = (swaggerObj: any, _opts: any, paths: any) => {
  if (swaggerObj === null) {
    return []
  }
  if (swaggerObj.name !== swaggerObj["x-ms-client-name"]) return []
  const path = paths.path || []
  path.push("x-ms-client-name")
  return [
    {
      message: `Value of 'x-ms-client-name' cannot be the same as ${swaggerObj.name} Property/Model.`,
      path: path,
    },
  ]
}

export default xmsClientNameParameter
