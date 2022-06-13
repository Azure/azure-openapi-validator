function checkApiVersion(param:any) {
  if (param.in !== "query") {
    return false
  }
  return true
}

const apiVersionName = "api-version"

// Check a operation to ensure it has a api-version parameter.

const hasApiVersionParameter = (apiPath:any, opts:any, paths:any) => {
  if (apiPath === null || typeof apiPath !== 'object') {
    return [];
  }

  // opts must contain the name of the parameterand the http methods to check for.
  if (opts === null || typeof opts !== 'object' || !opts.methods) {
    return [];
  }

  const path = paths.path || [];

  if (apiPath.parameters) {
    if (apiPath.parameters.some((p:any) => p.name === apiVersionName && checkApiVersion(p))) {
      return []
    }
  }
  const messages = []
  for (const method of Object.keys(apiPath)) {
    if ((opts.methods as string[]).includes(method)) {
      const param = apiPath[method]?.parameters?.filter((p:any) => p.name === apiVersionName )
      if (!param || param.length === 0) {
        messages.push({
          message: `Operation should include an 'api-version' parameter.`,
          path:[...path, method]
        })
        continue;
      }
      if (!checkApiVersion(param[0])) {
         messages.push({
          message: `Operation 'api-version' parameter should be a query parameter.`,
          path:[...path, method]
        })
      }
    }
  }

  return messages;
};

export default hasApiVersionParameter