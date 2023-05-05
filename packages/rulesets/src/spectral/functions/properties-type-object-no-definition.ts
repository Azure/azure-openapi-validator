// If a property is defined with `'type': 'object'`, it must also define an object body.
// RPC Code: RPC-Policy-V1-03
const errorMessage =
  "If Properties with type:object dont have a reference model defined, then the allowed types can only be primitive data types."
export const propertiesTypeObjectNoDefinition: any = (definitionObject: any, _opts: any, ctx: any) => {
  const values = Object.values(definitionObject)

  if ((values.length == 1 && values[0] === "object") || values[0] === "") {
    return [{ message: errorMessage, path: ctx.path }]
  } else if (values.length == 0) {
    return [{ message: errorMessage, path: ctx.path }]
  }
  return []
}
