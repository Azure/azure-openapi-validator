// If a property is defined with `'type': 'object'`, it must also define an object body.
// RPC Code: RPC-Policy-V1-03

export const propertiesTypeObjectNoDefinition: any = (definitionObject: any, _opts: any, ctx: any) => {
  const values = Object.values(definitionObject)

  for (let value of values) {
    if (values.length === 1) {
      if (value === "object") {
        return [
          {
            message:
              "If Properties with type:object dont have a reference model defined, then the allowed types can only be primitive data types.",
            path: ctx.path,
          },
        ]
      }
    }
  }
  return []
}
