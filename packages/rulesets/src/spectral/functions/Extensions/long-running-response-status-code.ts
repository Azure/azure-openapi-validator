// An x-ms-long-running-operation extension passes this rule if the operation that this extension has a valid response defined.

const longRunningResponseStatusCode = (
  methodOp: any,
  _opts: any,
  ctx: any,
  validResponseCodesList: any
) => {
  if (methodOp === null || typeof methodOp !== "object") {
    return [];
  }
  const path = ctx.path || [];
  const errors: any = [];
  const method = Object.getOwnPropertyNames(methodOp)[0];
  if (!["delete", "put", "patch", "post"].includes(method)) {
    return [];
  }
  const operationId = methodOp?.[method]?.operationId || "";
  if (!methodOp?.[method]?.["x-ms-long-running-operation"]) {
    return [];
  }
  if (methodOp?.[method]?.responses) {
    const responseCodes = Object.getOwnPropertyNames(methodOp?.[method]?.responses);
    const validResponseCodes = validResponseCodesList[method];
    const validResponseCodeString = validResponseCodes.join(" or ");
    for (const responseCode of responseCodes) {
      if (
        (responseCodes.length === 1 && !validResponseCodes.includes(responseCode)) ||
        (responseCode !== "default" && !validResponseCodes.includes(responseCode))
      ) {
        errors.push({
          message: `A '${method}' operation '${operationId}' with x-ms-long-running-operation extension must have a valid terminal success status code ${validResponseCodeString}.`,
          path: [...path, method],
        });
      }
    }
  }
  return errors;
};

export const longRunningResponseStatusCodeArm = (methodOp: any, _opts: any, ctx: any) => {
  const validResponseCodesList: any = {
    delete: ["200", "204"],
    post: ["200", "201", "202", "204"],
    put: ["200", "201"],
    patch: ["200", "201", "202"],
  };
  return longRunningResponseStatusCode(methodOp, _opts, ctx, validResponseCodesList);
};

export const longRunningResponseStatusCodeDataPlane = (methodOp: any, _opts: any, ctx: any) => {
  const validResponseCodesList: any = {
    delete: ["200", "204", "202"],
    post: ["200", "201", "202", "204"],
    put: ["200", "201", "202"],
    patch: ["200", "201", "202"],
  };
  return longRunningResponseStatusCode(methodOp, _opts, ctx, validResponseCodesList);
};
