// An x-ms-pageable extension passes this rule if the value for nextLinkName refers to a string property
// that exists on the schema for the 200 response of the parent operation.

import { getProperties } from "../utils";

export const nextLinkPropertyMustExist = (opt: any, _opts: any, ctx: any) => {
  if (opt === null || typeof opt !== "object") {
    return [];
  }
  if (opt["x-ms-pageable"] === undefined) {
    return [];
  }
  const path = ctx.path || [];
  const errors: any = [];
  const nextLinkName = opt["x-ms-pageable"]?.nextLinkName || null;
  const responseSchemaProperties = getProperties(opt?.responses?.["200"]?.schema);
  if (nextLinkName !== null && nextLinkName !== "") {
    if (
      Object.keys(responseSchemaProperties).length === 0 ||
      !Object.keys(responseSchemaProperties).includes(nextLinkName)
    ) {
      errors.push({
        message: `The property '${nextLinkName}' specified by nextLinkName does not exist in the 200 response schema. Please, specify the name of the property that provides the nextLink. If the model does not have the nextLink property then specify null.`,
        path: [...path],
      });
    }
  }
  return errors;
};
