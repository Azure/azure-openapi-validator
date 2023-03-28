import { getResourcesTypeHierarchy } from "./utils"

export const ParametersInPointGet = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }

  const path = ctx.path || []
  const keys = Object.keys(pathItem)
  if (keys.length < 1) {
    return []
  }
  const GET = "get"
  const errors = new Array()

  for (const uri of keys) {
    const hierarchy = getResourcesTypeHierarchy(uri)
    if (hierarchy.length >= 1 && pathItem[uri][GET]) {
      const params = pathItem[uri][GET]["parameters"]
      const queryParams = params.filter((param: { in: string; name: string }) => param.in === "query" && param.name !== "api-version")
      queryParams.map((param: { name: any }) => {
        errors.push({
          message: `${param.name} is a query parameter. Point Get's MUST not have query parameters other than api version.`,
          path: [path, uri, GET, "parameters"],
        })
      })
    }
  }

  return errors
}
