// Verify that put response body schemas are consistent between create and replace.

// This function assumes it is running on a resolved doc.
const consistentResponseSchemaForPut = (pathItem: any, _opts: any, paths: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }
  const path = paths.path || []

  const errors: any = []

  // resource schema is create operation response schema
  const createResponseSchema = (op: any) => op?.responses?.["201"]?.schema
  const resourceSchema = createResponseSchema(pathItem.put)
  if (resourceSchema) {
    const responseSchema = pathItem["put"]?.responses?.["200"]?.schema
    if (responseSchema && responseSchema !== resourceSchema) {
      errors.push({
        message: "200 response schema does not match 201 response schema. A PUT API must always return the same response schema for both the 200 and 201 status codes.",
        path: [...path, "put", "responses", "200", "schema"],
      })
    }
  }

  return errors
}

export default consistentResponseSchemaForPut
