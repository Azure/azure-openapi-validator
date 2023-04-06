// An x-ms-long-running-operation extension passes this rule if the operation that this extension has a valid response defined.

// operations that this rule evaluates
const RULE_OPERATION_NAMES = ["delete", "put", "patch", "post"]
// extension to indicate a long-running operation (LRO)
const LRO_EXTENSION = "x-ms-long-running-operation"
// valid response codes for long-running (LRO) ARM (Control Plane) operations
const ARM_LRO_RESPONSE_CODES_BY_OPERATION: any = {
  delete: ["200", "204"],
  post: ["200", "201", "202", "204"],
  put: ["200", "201"],
  patch: ["200", "201", "202"],
}
// valid response codes for long-running (LRO) Data Plane operations
const DATA_PLANE_LRO_RESPONSE_CODES_BY_OPERATION: any = {
  delete: ["200", "204", "202"],
  post: ["200", "201", "202", "204"],
  put: ["200", "201", "202"],
  patch: ["200", "201", "202"],
}

const longRunningResponseStatusCode = (pathObject: any, _opts: any, ctx: any, validResponseCodesList: any) => {
  if (pathObject === null || typeof pathObject !== "object") {
    return []
  }
  const path = ctx.path || []
  const errors: any = []
  const operationNames = Object.keys(pathObject)

  for (const operationName of operationNames) {
    const operation = pathObject?.[operationName]
    if (!operation?.[LRO_EXTENSION]) {
      continue
    }
    if (!RULE_OPERATION_NAMES.includes(operationName)) {
      continue
    }
    const operationId = operation.operationId || ""
    if (operation.responses) {
      const responseCodes = Object.keys(operation.responses)
      const validResponseCodes = validResponseCodesList[operationName]
      const validResponseCodeString = arrayToOrList(validResponseCodes)
      const withTerminalCode = validResponseCodes.some((code: string) => responseCodes.includes(code))
      if (!withTerminalCode) {
        errors.push({
          message: `A '${operationName}' operation '${operationId}' with extension '${LRO_EXTENSION}' must have a valid terminal success status code: ${validResponseCodeString}.`,
          path: [...path, operationName],
        })
      }
    }
  }

  return errors
}

export const longRunningResponseStatusCodeArm = (pathObject: any, _opts: any, ctx: any) => {
  return longRunningResponseStatusCode(pathObject, _opts, ctx, ARM_LRO_RESPONSE_CODES_BY_OPERATION)
}

export const longRunningResponseStatusCodeDataPlane = (pathObject: any, _opts: any, ctx: any) => {
  return longRunningResponseStatusCode(pathObject, _opts, ctx, DATA_PLANE_LRO_RESPONSE_CODES_BY_OPERATION)
}

// from an array of strings, return a string that separates the array elements as a list
const arrayToOrList = (array: string[]) => {
  if (array.length === 0) {
    return ""
  }
  if (array.length === 1) {
    return `'${array[0]}'`
  }
  if (array.length === 2) {
    return `'${array[0]}' or '${array[1]}'`
  }
  return `'${array.slice(0, -1).join(", ")}' or '${array[array.length - 1]}'`
}
