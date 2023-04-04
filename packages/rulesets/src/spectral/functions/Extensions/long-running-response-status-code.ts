// An x-ms-long-running-operation extension passes this rule if the operation that this extension has a valid response defined.
const longRunningResponseStatusCode = (methodOp: any, _opts: any, ctx: any, validResponseCodesList: any) => {
  if (methodOp === null || typeof methodOp !== "object") {
    return []
  }
  const path = ctx.path || []
  const errors: any = []
  const methods = Object.keys(methodOp)

  for (const method of methods) {
    if (!["delete", "put", "patch", "post"].includes(method)) {
      continue
    }
    if (!methodOp?.[method]?.["x-ms-long-running-operation"]) {
      continue
    }
    const operationId = methodOp?.[method]?.operationId || ""
    if (methodOp?.[method]?.responses) {
      const responseCodes = Object.keys(methodOp?.[method]?.responses)
      const validResponseCodes = validResponseCodesList[method]
      const validResponseCodeString = validResponseCodes.join(" or ")
      const withTerminalCode = validResponseCodes.some((code: string) => responseCodes.includes(code))
      if (!withTerminalCode) {
        errors.push({
          message: `A '${method}' operation '${operationId}' with x-ms-long-running-operation extension must have a valid terminal success status code ${validResponseCodeString}.`,
          path: [...path, method],
        })
      }
    }
  }

  return errors
}

export const longRunningResponseStatusCodeArm = (methodOp: any, _opts: any, ctx: any) => {
  const validResponseCodesList: any = {
    delete: ["200", "204"],
    post: ["200", "201", "202", "204"],
    put: ["200", "201"],
    patch: ["200", "201", "202"],
  }
  return longRunningResponseStatusCode(methodOp, _opts, ctx, validResponseCodesList)
}

export const longRunningResponseStatusCodeDataPlane = (methodOp: any, _opts: any, ctx: any) => {
  const validResponseCodesList: any = {
    delete: ["200", "204", "202"],
    post: ["200", "201", "202", "204"],
    put: ["200", "201", "202"],
    patch: ["200", "201", "202"],
  }
  return longRunningResponseStatusCode(methodOp, _opts, ctx, validResponseCodesList)
}
