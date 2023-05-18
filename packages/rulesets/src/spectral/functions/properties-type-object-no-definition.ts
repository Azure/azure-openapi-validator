// If a property is defined with `'type': 'object'`, it must also define an object body.
// RPC Code: RPC-Policy-V1-03
const errorMessageObject =
  "Properties with type:object that dont reference a model definition are not allowed. ARM doesnt allow generic type definitions as this leads to bad customer experience."
const errorMessageNull =
  "Properties with type NULL are not allowed. Either specify the type as object and reference a model or specify a primitive type."
export const propertiesTypeObjectNoDefinition: any = (definitionObject: any, opts: any, ctx: any) => {
  const path = ctx.path || []
  const errors = []
  if (definitionObject?.type === "") {
    errors.push({ message: errorMessageNull, path })
  }
  const values = Object.values(definitionObject)
  for (const val of values) {
    if (typeof val === "object") return []
    else continue
  }
  if (definitionObject?.type === "object") {
    errors.push({ message: errorMessageObject, path })
  }
  return errors
}
