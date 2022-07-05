import { diffSchema, getProperties, jsonPath } from "./utils"

function getGetOperationSchema(paths: string[], ctx: any) {
  const getOperationPath = [...paths, "get"]
  const getOperation = jsonPath(getOperationPath, ctx?.document?.parserResult?.data)
  if (!getOperation) {
    return undefined
  }
  return getOperation?.responses["200"]?.schema || getOperation?.responses["201"]?.schema
}

export const consistentPatchProperties = (patchOp: any, _opts: any, ctx: any) => {
  if (patchOp === null || typeof patchOp !== "object") {
    return []
  }
  const path = ctx.path || []

  const errors: any = []

  // resource schema is create operation response schema
  const patchBodySchema = patchOp?.parameters?.find((p: any) => p.in === "body")?.schema
  const patchBodySchemaIndex = patchOp?.parameters?.findIndex((p: any) => p.in === "body")

  // if patch doesn't return 200 or 201, will use the getOperationSchema
  const responseSchema =
    patchOp?.responses?.["200"]?.schema || patchOp?.responses?.["201"]?.schema || getGetOperationSchema(path.slice(0, -1), ctx)
  if (patchBodySchema && responseSchema) {
    const absents = diffSchema(patchBodySchema, responseSchema)
    absents.forEach((absent) => {
      errors.push({
        message: `The property '${absent}' in the request body doesn't appear in the resource model.`,
        path: [...path, "parameters", patchBodySchemaIndex, "schema"],
      })
    })
  }

  return errors
}

export const lroPatchReturns202 = (patchOp: any, _opts: any, ctx: any) => {
  if (patchOp === null || typeof patchOp !== "object") {
    return []
  }
  const path = ctx.path || []
  if (!patchOp["x-ms-long-running-operation"]) {
    return []
  }
  const errors: any = []
  if (patchOp?.responses && !patchOp?.responses["202"]) {
    errors.push({
      message: "The async patch operation should return 202.",
      path: [...path, "responses"],
    })
  }
  return errors
}

export const validatePatchBodyParamProperties = (patchOp: any, _opts: any, ctx: any) => {
  if (patchOp === null || typeof patchOp !== "object") {
    return []
  }

  if (!_opts.should && !_opts.shouldNot) {
    return []
  }
  const path = ctx.path || []

  const errors: any = []
  const bodyParameter = patchOp?.parameters?.find((p: any) => p.in === "body")?.schema
  if (bodyParameter) {
    const index = patchOp.parameters.findIndex((p: any) => p.in === "body")
    if (_opts.should) {
      const responseSchema =
        patchOp?.responses?.["200"]?.schema || patchOp?.responses?.["201"]?.schema || getGetOperationSchema(path.slice(0, -1), ctx)
      _opts.should.forEach((p: string) => {
        if (!getProperties(bodyParameter)?.[p] && getProperties(responseSchema)?.[p]) {
          errors.push({
            message: `The patch operation body parameter schema should contains property ${p}.`,
            path: [...path, "parameters", index],
          })
        }
      })
    }
    if (_opts.shouldNot) {
      _opts.shouldNot.forEach((p: string) => {
        if (getProperties(bodyParameter)?.[p]) {
          errors.push({
            message: `The patch operation body parameter schema should not contains property ${p}.`,
            path: [...path, "parameters", index],
          })
        }
      })
    }
  }
  return errors
}
