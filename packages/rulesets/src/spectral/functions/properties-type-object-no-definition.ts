// If a property is defined with `'type': 'object'`, it must also define an object body.
// RPC Code: RPC-Policy-V1-03
const errorMessageObject =
  "Properties with type:object that don't reference a model definition are not allowed. ARM doesn't allow generic type definitions as this leads to bad customer experience."
const errorMessageNull =
  "Properties with type NULL are not allowed. Either specify the type as object and reference a model or specify a primitive type."
export const propertiesTypeObjectNoDefinition: any = (definitionObject: any, opts: any, ctx: any) => {
  const path = ctx.path || []

  if (definitionObject?.properties) {
    if (definitionObject.properties === null) {
      return [{ message: errorMessageNull, path }]
    }
  }

  const values = Object.values(definitionObject)
  if (definitionObject?.type === "") {
    return [{ message: errorMessageNull, path }]
  }

  if (typeof definitionObject === "object") {
    if (definitionObject.properties === undefined) return [{ message: errorMessageObject, path }]
  }

  for (const val of values) {
    if (typeof val === "object") {
      if (val === null) {
        return [{ message: errorMessageObject, path }]
      }
      if (Object.keys(val).toString() === "" && Object.keys(val).length === 0) {
        return [{ message: errorMessageObject, path }]
      }
    } else continue
  }
  return []
}
