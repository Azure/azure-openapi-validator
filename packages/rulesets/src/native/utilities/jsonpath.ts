import {JSONPath} from "jsonpath-plus"

export function nodes(obj: any, pathExpression: string) {
  const result = JSONPath({ json: obj, path: pathExpression, resultType: "all" })
  return result.map((v:any) => ({ path: JSONPath.toPathArray(v.path), value: v.value, parent: v.parent }))
}

export function stringify(path: string[]) {
  const pathWithRoot = ["$", ...path]
  return JSONPath.toPathString(pathWithRoot)
}
