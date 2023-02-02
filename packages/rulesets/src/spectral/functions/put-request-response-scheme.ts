// Verifies if a PUT operation request and response schemas match.

import { isSchemaEqual } from "./utils"

export const putRequestResponseScheme = (putOp: any, _opts: any, ctx: any) => {
  if (putOp === null || typeof putOp !== "object") {
    return []
  }
  const path = ctx.path || []
  const errors: any = []
  if (!putOp.parameters) {
    return []
  }
  let reqBodySchema: object = {}
  let reqBodySchemaPath = ""
  for (let i = 0; i < putOp.parameters.length; i++) {
    const parameter = putOp.parameters[i]
    if (parameter.in === "body") {
      reqBodySchemaPath = `parameters[${i}].schema`
      reqBodySchema = parameter.schema ? parameter.schema : {}
      break
    }
  }
  if (Object.keys(reqBodySchema).length === 0) {
    return []
  }
  const responseCode = putOp.responses["200"] ? "200" : "201"
  const respModelPath = `responses[${responseCode}].schema`
  const respModel = putOp.responses[responseCode]?.schema ? putOp.responses[responseCode].schema : {}
  if (!isSchemaEqual(reqBodySchema, respModel)) {
    errors.push({
      message: `A PUT operation request body schema should be the same as its 200 response schema, to allow reusing the same entity between GET and PUT. If the schema of the PUT request body is a superset of the GET response body, make sure you have a PATCH operation to make the resource updatable. Operation: '${putOp.operationId}' Request Model: '${reqBodySchemaPath}' Response Model: '${respModelPath}'`,
      path: [...path],
    })
  }
  return errors
}
