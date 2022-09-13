// Validates if a Post LRO Operation with return value has long running operation options extensions enabled.

export const longRunningOperationsOptionsValidator = (postOp: any, _opts: any, ctx: any) => {
  if (postOp === null || typeof postOp !== "object") {
    return [];
  }
  const path = ctx.path || [];
  if (!postOp["x-ms-long-running-operation"]) {
    return [];
  }
  const errors: any = [];
  const responses = postOp?.responses;
  let schemaAvailable = false;
  for (const responseCode in responses) {
    if (responseCode[0] === "2" && responses[responseCode]?.schema !== undefined) {
      schemaAvailable = true;
      break;
    }
  }
  if (
    schemaAvailable &&
    (postOp["x-ms-long-running-operation-options"] === undefined ||
      (postOp["x-ms-long-running-operation-options"]["final-state-via"] !== "location" &&
        postOp["x-ms-long-running-operation-options"]["final-state-via"] !==
        "azure-async-operation"))
  ) {
    errors.push({
      message: `A LRO Post operation with return schema must have "x-ms-long-running-operation-options" extension enabled.`,
      path: [...path],
    });
  }
  return errors;
};
