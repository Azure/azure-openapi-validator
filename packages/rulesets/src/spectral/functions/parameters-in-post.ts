export const parametersInPost = (postParameters: any, _opts: any, ctx: any) => {
  if (postParameters === null || !Array.isArray(postParameters)) {
    return []
  }

  if (postParameters.length === 0) {
    return []
  }

  const path = ctx.path
  const queryParams = postParameters.filter((param) => param.in === "query" && param.name !== "api-version")
  const errors = queryParams.map((param) => {
    return {
      message: `${param.name} is a query parameter. Post operation must not contain any query parameter other than api-version.`,
      path: path,
    }
  })

  return errors
}
