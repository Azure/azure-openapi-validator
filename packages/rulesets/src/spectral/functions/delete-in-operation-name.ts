/**
 * This rule passes if the operation id of HTTP Method confirms to M1009
 * e.g. For DELETE method User_Delete is valid name
 */

export const deleteInOperationName = (operationId: any, _opts: any, ctx: any) => {
    if (operationId === "" || typeof operationId !== 'string') {
        return [];
    }
    if (!operationId.includes("_")) {
        return [];
    }
    const path = ctx.path || [];
    const errors: any = [];
    if (!operationId.match(/^(\w+)_(Delete)/) && !operationId.match(/^(Delete)/)) {
        errors.push({
            message: `'DELETE' operation '${operationId}' should use method name 'Delete'. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.`,
            path: [...path],
        });
    }
    return errors;
};
