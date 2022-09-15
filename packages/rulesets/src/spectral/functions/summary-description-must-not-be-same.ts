// Check that format is valid for a schema type.
// Valid formats are those defined in the OpenAPI spec and extensions in autorest.
// - https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#data-types
// - https://github.com/Azure/autorest/blob/main/packages/libs/openapi/src/v3/formats.ts

import type { IFunctionResult } from "@stoplight/spectral-core"

// `input` is the schema of a request or response body
function checkSummaryAndDescription(op: any, options: any, ctx: any): IFunctionResult[] {
  const errors: IFunctionResult[] = []
  const path = ctx.path
  if (op.summary && op.description && op.summary.trim() === op.description.trim()) {
    errors.push({
      message: ``,
      path,
    })
  }
  return errors
}

export default checkSummaryAndDescription
