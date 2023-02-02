// This rule passes if the entity contains no more than 1 underscore

export const operationIdSingleUnderscore = (operationId: any, _opts: any, ctx: any) => {
  if (operationId === "" || typeof operationId !== "string") {
    return []
  }
  if (!operationId.includes("_")) {
    return []
  }
  const path = ctx.path || []
  const errors: any = []
  if (operationId.match(/_/g)!.length > 1) {
    errors.push({
      message: `Only 1 underscore is permitted in the operation id, following Noun_Verb conventions`,
      path: [...path],
    })
  }
  return errors
}
