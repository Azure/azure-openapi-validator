import { getResourcesPathHierarchyBasedOnResourceType } from "./utils"

export const ParametersInPointGet = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }

  const path = ctx.path || []
  const uris = Object.keys(pathItem)
  if (uris.length < 1) {
    return []
  }
  const GET = "get"
  const errors: any[] = []

  for (const uri of uris) {
    const hierarchy = getResourcesPathHierarchyBasedOnResourceType(uri)
    if (hierarchy.length >= 1 && pathItem[uri][GET]) {
      const params = pathItem[uri][GET]["parameters"]
      const queryParams = params.filter((param: { in: string; name: string }) => param.in === "query" && param.name !== "api-version")
      queryParams.map((param: { name: any }) => {
        errors.push({
          message: `Query parameter ${param.name} should be removed. Point Get's MUST not have query parameters other than api version.`,
          path: [path, uri, GET, "parameters"],
        })
      })
    }
  }

  return errors
}
