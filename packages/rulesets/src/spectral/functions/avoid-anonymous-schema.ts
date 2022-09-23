//This rule appears if in the parameter definition you have anonymous types.
//Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.
const avoidAnonymousSchema = (schema: any, _opts: any, paths: any) => {
  if (schema === null || schema["x-ms-client-name"] !== undefined) {
    return []
  }
  const path = paths.path || []

  const properties: object = schema.properties
  if (
    (properties === undefined || Object.keys(properties).length === 0) &&
    schema.additionalProperties === undefined &&
    schema.allOf === undefined
  ) {
    return []
  }
  return [
    {
      message:
        'Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.',
      path,
    },
  ]
}

export default avoidAnonymousSchema
