// Verifies if a PUT operation request and response schemas match.

export const putRequestResponseScheme = (putOp: any, _opts: any, ctx: any) => {
  if (putOp === null || typeof putOp !== "object") {
    return [];
  }
  const path = ctx.path || [];
  const errors: any = [];
  if (!putOp.parameters) {
    return [];
  }
  let reqBodySchemaRef = "";
  const swagger = ctx.document.parserResult.data;
  const globalParameters = swagger.parameters ? swagger.parameters : {};
  for (const parameter of putOp.parameters) {
    if (parameter.in === "body") {
      reqBodySchemaRef = parameter.schema?.$ref ? parameter.schema.$ref : "";
      break;
    } else if (Object.keys(parameter).length === 1 && Object.keys(parameter)[0] === "$ref") {
      const globalParameterName = parameter.$ref.split("/").reverse()[0];
      if (
          Object.keys(globalParameters).includes(globalParameterName) &&
          globalParameters[globalParameterName].in === "body"
      ) {
        reqBodySchemaRef = globalParameters[globalParameterName].schema?.$ref
            ? globalParameters[globalParameterName].schema.$ref
            : "";
      }
    }
  }
  if (reqBodySchemaRef === "") {
    return [];
  }
  const respModelRef = putOp.responses["200"].schema?.$ref ? putOp.responses["200"].schema.$ref : "";
  if (reqBodySchemaRef !== respModelRef) {
    const [reqBodySchema, respModel] = [
      reqBodySchemaRef.split("/").reverse()[0],
      respModelRef.split("/").reverse()[0],
    ];
    errors.push({
      message: `A PUT operation request body schema should be the same as its 200 response schema, to allow reusing the same entity between GET and PUT. If the schema of the PUT request body is a superset of the GET response body, make sure you have a PATCH operation to make the resource updatable. Operation: '${putOp.operationId}' Request Model: '${reqBodySchema}' Response Model: '${respModel}'`,
      path: [...path],
    });
  }
  return errors;
};
