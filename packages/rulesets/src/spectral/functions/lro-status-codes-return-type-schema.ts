// Verifies whether an LRO PUT operation returns response models for 200/201 status codes.

export const lroStatusCodesReturnTypeSchema = (putOp: any, _opts: any, ctx: any) => {
  if (putOp === null || typeof putOp !== "object") {
    return [];
  }
  const path = ctx.path || [];
  if (!putOp["x-ms-long-running-operation"]) {
    return [];
  }
  const errors: any = [];
  const operationId = putOp["operationId"] || "";
  const responseCodes = ["200", "201"];
  for (const responseCode of responseCodes) {
    if (putOp?.responses && putOp?.responses[responseCode]) {
      if (
          !putOp?.responses[responseCode].schema ||
          Object.keys(putOp?.responses[responseCode].schema).length === 0
      ) {
        errors.push({
          message: `200/201 Responses of long running operations must have a schema definition for return type. OperationId: '${operationId}', Response code: '${responseCode}'`,
          path: [...path, "responses", `${responseCode}`],
        });
      }
    }
  }
  return errors;
};
