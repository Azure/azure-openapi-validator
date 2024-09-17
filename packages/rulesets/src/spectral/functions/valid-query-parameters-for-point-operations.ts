import { isPointOperation } from "./utils"

export const validQueryParametersForPointOperations = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }

  const path = ctx.path || []
  const uris = Object.keys(pathItem)
  if (uris.length < 1) {
    return []
  }
  const pointOperations = new Set(["get", "put", "patch", "delete"])
  const errors: any[] = []

  for (const uri of uris) {
    //check if the path is a point operation 
    if (isPointOperation(uri)) {
      const verbs = Object.keys(pathItem[uri])
      for (const verb of verbs) {
        //check query params only for point operations/verbs
        if (pointOperations.has(verb)) {
          const params = pathItem[uri][verb]["parameters"]
          const queryParams = params?.filter((param: { in: string; name: string }) => param.in === "query" && param.name !== "api-version")
          queryParams?.map((param: { name: any }) => {
            errors.push({
              message: `Query parameter ${param.name} should be removed. Point operation '${verb}' MUST not have query parameters other than api-version.`,
              path: [path, uri, verb, "parameters"],
            })
          })
        }
      }
    }
  }

  return errors
}
