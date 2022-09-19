// Validates if the name of parameter model and x-ms-client-name(if exists) does not match.

export const xmsClientName = (opt: any, _opts: any, ctx: any) => {
  if (opt === null || typeof opt !== "object") {
    return [];
  }
  if (opt["x-ms-client-name"] === undefined) {
    return [];
  }
  const path = ctx.path || [];
  const errors: any = [];
  if (path.includes("parameters")) {
    if (opt["x-ms-client-name"] === opt.name) {
      errors.push({
        message: `Value of 'x-ms-client-name' cannot be the same as '${opt.name}' Property/Model.`,
        path: [...path],
      });
    }
  } else {
    if (opt["x-ms-client-name"] === path.slice(-1)[0]) {
      errors.push({
        message: `Value of 'x-ms-client-name' cannot be the same as '${path.slice(-1)[0]}' Property/Model.`,
        path: [...path],
      });
    }
  }
  return errors;
};
