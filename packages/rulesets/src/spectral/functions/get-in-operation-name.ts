/**
 * This rule passes if the operation id of HTTP Method confirms to M1005
 * e.g. For Get method User_Get or User_List are valid names
 */

export const getInOperationName = (operationId: any, _opts: any, ctx: any) => {
  if (operationId === "" || typeof operationId !== "string") {
    return []
  }
  const path = ctx.path || []
  const errors: any = []
  if (!operationId.match(/^(\w+)_(Get|List)/) && !operationId.match(/^(Get|List)/)) {
    errors.push({
      message: `'GET' operation '${operationId}' should use method name 'Get' or Method name start with 'List'. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.`,
      path: [...path],
    })
  }
  return errors
}
