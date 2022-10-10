import { diffSchema, getGetOperationSchema } from "./utils"

/**
 * verify if the properties in patch body also present in the resource model and it has the same layout with the resource model .
 */
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
        message: `The property '${absent}' in the request body either not apppear in the resource model or has the wrong level.`,
        path: [...path, "parameters", patchBodySchemaIndex, "schema"],
      })
    })
  }

  return errors
}
