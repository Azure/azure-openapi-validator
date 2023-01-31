// x-ms-paths could theoretically overload a path in another json.

export const xmsPathsMustOverloadPaths = (xmsPaths: any, _opts: any, ctx: any) => {
  if (xmsPaths === null || typeof xmsPaths !== "object") {
    return []
  }
  const path = ctx.path || []
  const errors: any = []
  const swagger = ctx?.documentInventory?.resolved
  for (const xmsPath in xmsPaths) {
    const pathName = xmsPath.split("?")[0]
    if (!Object.keys(swagger.paths).includes(pathName)) {
      errors.push({
        message: `Paths in x-ms-paths must overload a normal path in the paths section, i.e. a path in the x-ms-paths must either be same as a path in the paths section or a path in the paths sections followed by additional parameters.`,
        path: [...path, xmsPath],
      })
    }
  }
  return errors
}
