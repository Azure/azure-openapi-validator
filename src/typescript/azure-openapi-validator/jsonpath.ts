import * as JSONPath from "jsonpath-plus"

export function nodes(obj: any, pathExpression: string) {
  const result = JSONPath.JSONPath({ json: obj, path: pathExpression, resultType: "all" })
  return result.map(v => ({ path: JSONPath.JSONPath.toPathArray(v.path), value: v.value, parent: v.parent }))
}

export function stringify(path: string[]) {
  return JSONPath.JSONPath.toPathString(path)
}
