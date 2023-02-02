// The `x-ms-client-name` extension is used to change the name of a parameter or property in the generated code.
// By using the 'x-ms-client-name' extension, a name can be defined for use specifically in code generation, separately from the name on the wire.
// It can be used for query parameters and header parameters, as well as properties of schemas. This name is case sensitive.
const xmsClientNameProperty = (swaggerObj: any, _opts: any, paths: any) => {
  if (swaggerObj === null || typeof swaggerObj !== "string") {
    return []
  }
  const path = paths.path || []
  if (!path || path.length <= 2) return []
  const name: string = path[path.length - 2]
  if (swaggerObj !== name) return []
  return [
    {
      message: `Value of 'x-ms-client-name' cannot be the same as ${name} Property/Model.`,
      path: path,
    },
  ]
}

export default xmsClientNameProperty
