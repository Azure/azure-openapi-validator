// Check the operationsApi schema conforms to ARM guideline

import type { IFunctionResult } from "@stoplight/spectral-core"
import type { JsonPath } from "@stoplight/types"
import { getProperty } from "./utils"

// `input` is the operations api schema
function operationsApiSchema(schema: any, options: any, { path }: { path: JsonPath }): IFunctionResult[] {
  if (schema === null || typeof schema !== "object") {
    return [] as IFunctionResult[]
  }
  const errors: IFunctionResult[] = []
  let isValid = true
  const value = getProperty(schema, "value")
  const items = value?.items

  if (value && items) {
    const name = getProperty(items, "name")
    const display = getProperty(items, "display")
    const isDataAction = getProperty(items, "isDataAction")
    if (!name || !isDataAction || !display) {
      isValid = false
    } else {
      if (["description", "provider", "operation", "resource"].some((e) => !getProperty(display, e))) {
        isValid = false
      }
    }
  } else {
    isValid = false
  }
  if (!isValid) {
    errors.push({
      message: path[1] as string,
      path,
    })
  }
  return errors
}

export default operationsApiSchema
