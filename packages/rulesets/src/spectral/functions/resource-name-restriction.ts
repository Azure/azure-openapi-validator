// Check conformance to Azure parameter naming conventions:

//system-defined parameters => needs to be excluded from validation
const EXCEPTION_LIST = ["resourceGroupName", "privateEndpointConnectionName", "managementGroupName"]
export const resourceNameRestriction = (paths: any, _opts: any, ctx: any) => {
  if (paths === null || typeof paths !== "object") {
    return []
  }

  const path = ctx.path || []
  const errors: any[] = []

  function getPathParameter(pathItem: any, paramName: string) {
    let parameters: any[] = []
    const method = Object.keys(pathItem).find((k) => k !== "parameters")
    if (method) {
      const operationParameters = pathItem[method].parameters || []
      parameters = parameters.concat(operationParameters)
    }
    if (pathItem.parameters) {
      parameters = parameters.concat(pathItem.parameters)
    }
    return parameters.find((p) => p.in === "path" && p.name === paramName)
  }

  for (const pathKey of Object.keys(paths)) {
    const parts = pathKey.split("/").slice(1)
    parts.forEach((v, i) => {
      if (v.includes("}")) {
        const param = v.match(/[^{}]+(?=})/)?.[0]
        // Get the preceding path segment
        if (param?.match(/^\w+Name+$/) && !EXCEPTION_LIST.includes(param)) {
          const paramDefinition = getPathParameter(paths[pathKey], param)
          // resource name param with enum doesnt need to explicitly have pattern specified
          if (paramDefinition && !paramDefinition.enum && !paramDefinition.pattern) {
            errors.push({
              message: `The resource name parameter '${param}' should be defined with a 'pattern' restriction.`,
              path: [...path, pathKey],
            })
          }
        }
      }
    })
  }

  return errors
}

export default resourceNameRestriction
