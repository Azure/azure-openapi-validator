/**
 * This rule passes if the operation id doesn't contain a repeated value before and after the underscore
 * e.g. User_GetUser
 *   or Users_DeleteUser
 *   or User_ListUsers
 */

export const operationIdNounVerb = (operationId: any, _opts: any, ctx: any) => {
  if (operationId === "" || typeof operationId !== "string") {
    return [];
  }
  if (!operationId.includes("_")) {
    return [];
  }
  const path = ctx.path || [];
  const errors: any = [];
  const nounPartOfOperationId = operationId.split("_")[0];
  const nounSearchPattern =
    nounPartOfOperationId.slice(-1) === "s"
      ? `${nounPartOfOperationId}?`
      : `${nounPartOfOperationId}`;
  const verbPartOfOperationId = operationId.split("_")[1];
  if (verbPartOfOperationId.match(nounSearchPattern)) {
    errors.push({
      message: `Per the Noun_Verb convention for Operation Ids, the noun '${nounPartOfOperationId}' should not appear after the underscore`,
      path: [...path],
    });
  }
  return errors;
};
