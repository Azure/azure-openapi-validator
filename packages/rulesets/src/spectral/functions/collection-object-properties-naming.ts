// Check that the collection object must have a property named `value`.

import { getProperty, isPageableOperation } from "./utils"

// The code assumes it is running on a resolved doc
const collectionObjectPropertiesNaming = (op: any, _opts: any, paths: any) => {
  if (op === null || typeof op !== "object") {
    return []
  }
  const path = paths.path || []

  const errors: any[] = []

  const regex = /.+_List([^_]*)$/
  if (op && regex.test(op.operationId) && isPageableOperation(op)) {
    const schema = op.responses?.["200"]?.schema
    const valueSchema = getProperty(schema, "value")
    if (schema && !(valueSchema && valueSchema.type === "array")) {
      errors.push({
        message: `Collection object returned by list operation '${op.operationId}' with 'x-ms-pageable' extension, has no property named 'value'.`,
        path: path.concat(["responses", "200", "schema"]),
      })
    }
  }
  return errors
}

export default collectionObjectPropertiesNaming
