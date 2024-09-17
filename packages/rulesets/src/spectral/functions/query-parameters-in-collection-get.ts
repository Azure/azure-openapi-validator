import { isListOperation } from "../../native/utilities/rules-helper"

export const queryParametersInCollectionGet = (pathItem: any, _opts: any, ctx: any) => {
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
    //check if GET op is defined & the GET op is a collection get/list call
    if (pathItem[uri][GET] && isListOperation(uri)) {
      const params = pathItem[uri][GET]["parameters"]
      const queryParams = params?.filter(
        (param: { in: string; name: string }) => param.in === "query" && param.name !== "api-version" && param.name !== "$filter",
      )
      queryParams?.forEach((param: { name: any }) => {
        errors.push({
          message: `Query parameter ${param.name} should be removed. Collection Get's/List operation MUST not have query parameters other than api version & OData filter.`,
          path: [path, uri, GET, "parameters"],
        })
      })
    }
  }

  return errors
}
