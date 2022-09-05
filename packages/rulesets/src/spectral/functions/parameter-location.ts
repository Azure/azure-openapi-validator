// Check that format is valid for a schema type.
// Valid formats are those defined in the OpenAPI spec and extensions in autorest.
// - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#data-types
// - https://github.com/Azure/autorest/blob/main/packages/libs/openapi/src/v3/formats.ts

import type { IFunctionResult } from "@stoplight/spectral-core"
import type { JsonPath } from "@stoplight/types"

// `input` is the parameter schema
function paramLocation(paramSchema: any, options: any, { path }: { path: JsonPath }): IFunctionResult[] {
  if (paramSchema === null || typeof paramSchema !== "object") {
    return [] as IFunctionResult[]
  }
  const errors: IFunctionResult[] = []

  if (!paramSchema["x-ms-parameter-location"]) {
    errors.push({
      message: ``,
      path,
    })
  }
  return errors
}

export default paramLocation
