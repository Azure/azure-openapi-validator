import { getGetOperationSchema, getProperties } from "./utils"

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
            message: `The patch operation body parameter schema should contains property '${p}'.`,
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
