// Service-defined (reserved) resource names must be represented as an enum type with modelAsString set to true, not as a static string in the path.
// RPC Code: RPC-ConstrainedCollections-V1-04

export const reservedResourceNamesAsEnum = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }
  const path = ctx.path || []
  const keys = Object.keys(pathItem)
  if (keys.length < 1) {
    return []
  }

  // e.g., /Microsoft.Abc/wordOne/wordTwo
  const pathName = keys[0]
  // match paths that end with /wordEndingWithSs/word or /wordEndingWithS/{word}. E.g., /resourceTypes/resourceName or /resourceTypes/{resourceName}
  if (!pathName.match(/.*\/\w+s\/\w+$/)) {
    return []
  }
  // last word of the path name. e.g., /Microsoft.Abc/wordOne/wordTwo -> wordTwo
  const lastPathWord = pathName.split("/").pop() ?? ""
  // relevant operations for constrained resource collections
  const includedOperations = ["get", "put", "delete", "patch"]

  const operations: { [key: string]: any } = {}

  for (let op in includedOperations) {
    if (pathItem[pathName][op]) {
      operations[op] = pathItem[pathName][op]
    }
  }

  const errors = []

  for (const [opName, op] of Object.entries(operations)) {
    if (op["parameters"]?.["x-ms-enum"]?.["modelAsString"] !== true) {
      errors.push({
        message: `The service-defined (reserved name) resource "${lastPathWord}" must be represented as a path parameter enum with \`modelAsString\` set to \`true\``,
        path: [...path, opName],
      })
    }
  }

  return errors
}
