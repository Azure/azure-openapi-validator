//This rule appears if in the parameter definition you have anonymous types.
//Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.
const avoidAnonymousParameter = (parameter:any, _opts:any, paths:any) => {
  console.log(typeof(parameter));
  console.log(parameter);
  if (parameter === null || parameter.schema === undefined || parameter["x-ms-client-name"] !== undefined) {
    return [];
  }
  const path = paths.path || paths.target || [];

  const properties: any[] = parameter.schema.properties;
  if ((properties === undefined || properties.length === 0) &&
      parameter.AdditionalProperties === undefined &&
      parameter.AllOf === undefined) {
    return true;
  }
  return [{
    message: 'Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.',
    path,
  }];
  
};

export default avoidAnonymousParameter
