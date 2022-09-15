/**
 * This rule passes if the operation id of HTTP Method confirms to M1006
 * e.g. For PUT method User_Create is valid name
 */

export const putInOperationName = (operationId: any, _opts: any, ctx: any) => {
  if (operationId === "" || typeof operationId !== "string") {
    return [];
  }
  if (!operationId.includes("_")) {
    return [];
  }
  const path = ctx.path || [];
  const errors: any = [];
  if (!operationId.match(/^(\w+)_(Create)/) && !operationId.match(/^(Create)/)) {
    errors.push({
      message: `'PUT' operation '${operationId}' should use method name 'Create'. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.`,
      path: [...path],
    });
  }
  return errors;
};
