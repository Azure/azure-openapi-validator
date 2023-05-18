// If a property is defined with `'type': 'object'`, it must also define an object body.
// RPC Code: RPC-Policy-V1-03
const errorMessage =
  "If Properties with type:object dont have a reference model defined, then the allowed types can only be primitive data types."
export const propertiesTypeObjectNoDefinition: any = (definitionObject: any, _opts: any, ctx: any) => {
  if (definitionObject?.type === "") {
    return [{ message: errorMessage, path: ctx.path }]
  }
  const values = Object.values(definitionObject)
  for (const val of values) {
    if (typeof val === "object") return []
    else continue
  }
  return [{ message: errorMessage, path: ctx.path }]
}
