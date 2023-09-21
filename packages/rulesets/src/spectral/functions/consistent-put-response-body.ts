// Verify that put response body schemas are consistent between create and replace.

// This function assumes it is running on a resolved doc.
const consistentputresponsebody = (pathItem: any, _opts: any, paths: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }
  const path = paths.path || []

  const errors: any = []

  // resource schema is create operation response schema
  const createResponseSchema = (op: any) => op?.responses?.["201"]?.schema
  const resourceSchema = createResponseSchema(pathItem.put) || createResponseSchema(pathItem.patch)
  if (resourceSchema) {
    const responseSchema = pathItem["put"]?.responses?.["200"]?.schema
    if (responseSchema && responseSchema !== resourceSchema) {
      errors.push({
        message: "Response body schema does not match create response body schema.",
        path: [...path, "put", "responses", "200", "schema"],
      })
    }
  }

  return errors
}

export default consistentputresponsebody
