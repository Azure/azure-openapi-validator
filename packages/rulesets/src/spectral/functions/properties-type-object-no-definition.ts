// If a property is defined with `'type': 'object'`, it must also define an object body.
// RPC Code: RPC-Policy-V1-03

const errorMessage =
  "If Properties with type:object dont have a reference model defined, then the allowed types can only be primitive data types."

export const propertiesTypeObjectNoDefinition: any = (definitionObject: any, _opts: any, ctx: any) => {
  // if (definitionObject?.properties || definitionObject?.additionalProperties || definitionObject?.allOf) {
  //   return []
  // } else
  const valuess = Object.values(definitionObject)
  // if (definitionObject?.properties || definitionObject?.additionalProperties || definitionObject?.allOf) {
  //   return []
  // }
  // } else if (!definitionObject.hasOwnProperty("type")) {
  //   return [{ message: errorMessage, path: ctx.path }]
  // }
  if (definitionObject.hasOwnProperty("type")) {
    // if (definitionObject?.properties || definitionObject?.additionalProperties || definitionObject?.allOf) {
    //   return []
    // }
    if (definitionObject.type === "") {
      return [{ message: errorMessage, path: ctx.path }]
    }
  }
  if (typeof definitionObject !== "object") {
    return []
  }
  for (const val of valuess) {
    if (typeof val === "object") return []
    else continue
  }
  return [{ message: errorMessage, path: ctx.path }]
}
