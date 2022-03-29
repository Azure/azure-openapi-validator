//This rule appears if in the parameter definition you have anonymous types.
//Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.
const avoidAnonymousParameter = (parameters:any, _opts:any, paths:any) => {
  if (parameters === null || parameters.schema === undefined || parameters["x-ms-client-name"] !== undefined) {
    return [];
  }
  const path = paths.path || paths.target || [];

  const properties: object = parameters.schema.properties;
  if ((properties === undefined || Object.keys(properties).length === 0) &&
      parameters.additionalProperties === undefined &&
      parameters.allOf === undefined) {
    return [];
  }
  return [{
    message: 'Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.',
    path,
  }];
  
};

export default avoidAnonymousParameter
