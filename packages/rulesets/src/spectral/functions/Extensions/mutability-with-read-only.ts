// Verify that mutability values are valid in context of Read Only property.

export const mutabilityWithReadOnly = (prop: any, _opts: any, ctx: any) => {
  if (prop === null || typeof prop !== "object") {
    return [];
  }
  // The given clause filters for readOnly !== undefined and x-ms-mutability !== undefined
  if (prop["x-ms-mutability"].length === 0) {
    return [];
  }
  const path = ctx.path || [];
  const errors: any = [];
  let hasErrors = false;
  let invalidValues = "";
  if (prop.readOnly === true) {
    if (prop["x-ms-mutability"].length !== 1 || prop["x-ms-mutability"][0] !== "read") {
      hasErrors = true;
      invalidValues = prop["x-ms-mutability"].join(", ");
    }
  } else {
    if (prop["x-ms-mutability"].length === 1 && prop["x-ms-mutability"][0] === "read") {
      hasErrors = true;
      invalidValues = "read";
    }
  }
  if (hasErrors) {
    errors.push({
      message: `When property is modeled as "readOnly": true then x-ms-mutability extension can only have "read" value. When property is modeled as "readOnly": false then applying x-ms-mutability extension with only "read" value is not allowed. Extension contains invalid values: '${invalidValues}'.`,
      path: [...path],
    });
  }
  return errors;
};
