import { createRulesetFunction } from "@stoplight/spectral-core"
import { getGetOperationSchema, getProperties } from "./utils"
export type Options = {
  schema: Record<string, unknown>
}

/*
 * Custom function to verify whether the patch body should or should not include some properties.
 */

export const validatePatchBodyParamProperties = createRulesetFunction<unknown, Options>(
  {
    input: null,
    options: {
      type: "object",
      properties: {
        should: {
          type: "array",
          items: {
            type: "string",
          },
        },
        shouldNot: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      additionalProperties: false,
    },
  },
  (patchOp: any, _opts: any, ctx: any) => {
    if (patchOp === null || typeof patchOp !== "object") {
      return []
    }
    const path = ctx.path || []

    const errors: any = []
    const bodyParameter = patchOp.parameters?.find((p: any) => p.in === "body")?.schema
    if (bodyParameter) {
      const index = patchOp.parameters.findIndex((p: any) => p.in === "body")
      if (_opts.should) {
        const responseSchema =
          patchOp.responses?.["200"]?.schema || patchOp.responses?.["201"]?.schema || getGetOperationSchema(path.slice(0, -1), ctx)
        _opts.should.forEach((p: string) => {
          if (!getProperties(bodyParameter)?.[p] && getProperties(responseSchema)?.[p]) {
            errors.push({
              message: `The patch operation body parameter schema should contain property '${p}'.`,
              path: [...path, "parameters", index],
            })
          }
        })
      }
      if (_opts.shouldNot) {
        _opts.shouldNot.forEach((p: string) => {
          const property = getProperties(bodyParameter)?.[p]
          if (property) {
            let isPropertyReadOnly = false
            let isPropertyImmutable = false

            if (property["readOnly"] && property["readOnly"] === true) {
              isPropertyReadOnly = true
            }

            if (property["x-ms-mutability"] && Array.isArray(property["x-ms-mutability"])) {
              const schemaArray = property["x-ms-mutability"]
              if (!schemaArray.includes("update")) {
                isPropertyImmutable = true
              }
            }

            if (!(isPropertyReadOnly || isPropertyImmutable)) {
              errors.push({
                message: `Mark the top-level property "${p}", specified in the patch operation body, as readOnly or immutable. You could also choose to remove it from the request payload of the Patch operation. These properties are not patchable.`,
                path: [...path, "parameters", index],
              })
            }
          }
        })
      }
    }
    return errors
  }
)
