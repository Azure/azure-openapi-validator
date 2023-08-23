const avoidAdditionalProperties = (schema: any, _opts: any, paths: any) => {
  if (schema === null) {
    return []
  }
  const path = paths.path || {}
  if ("tags" === path[path.length - 1] && "additionalProperties" in schema) {
    return
  } else if ("tags" !== path[path.length - 1] && "additionalProperties" in schema) {
    return [
      {
        message: "The use of additionalProperties is not allowed except for user defined tags on tracked resources.",
        path,
      },
    ]
  }
  return
}
export default avoidAdditionalProperties
