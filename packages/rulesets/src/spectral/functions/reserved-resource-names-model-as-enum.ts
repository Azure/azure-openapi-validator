// Service-defined (reserved) resource names must be represented as an enum type with modelAsString set to true, not as a static string in the path.
// RPC Code: RPC-ConstrainedCollections-V1-04

const ARM_ALLOWED_RESERVED_NAMES = ["operations"]
// relevant operations for constrained resource collections. note: post is not included
const INCLUDED_OPERATIONS = ["get", "put", "delete", "patch"]

export const reservedResourceNamesModelAsEnum = (pathItem: any, _opts: any, ctx: any) => {
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

  if (ARM_ALLOWED_RESERVED_NAMES.includes(lastPathWord)) {
    return []
  }

  const errors = []

  for (const op of INCLUDED_OPERATIONS) {
    if (pathItem[pathName][op]) {
      errors.push({
        message: `The service-defined (reserved name) resource "${lastPathWord}" must be represented as a path parameter enum with \`modelAsString\` set to \`true\`.`,
        path: [...path, pathName, op],
      })
    }
  }

  return errors
}
