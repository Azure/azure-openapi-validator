/**
 * This rule passes if the operation id of HTTP Method confirms to M1007
 * e.g. For PUT method User_Update is valid name
 */

export const patchInOperationName = (operationId: any, _opts: any, ctx: any) => {
  if (operationId === "" || typeof operationId !== "string") {
    return []
  }
  if (!operationId.includes("_")) {
    return []
  }
  const path = ctx.path || []
  const errors: any = []
  if (!operationId.match(/^(\w+)_(Update)/) && !operationId.match(/^(Update)/)) {
    errors.push({
      message: `'PATCH' operation '${operationId}' should use method name 'Update'. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.`,
      path: [...path],
    })
  }
  return errors
}
