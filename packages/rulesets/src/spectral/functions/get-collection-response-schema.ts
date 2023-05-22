// Verifies that collection get schemas have only the `value` and `nextLink` properties in their models.

const ALLOWED_KEYS = ["value", "nextLink"]
const ERROR_MESSAGE = "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model."

// TODO: might need to use something like getCollectionApiInfo() in arm-helper.ts
// TODO: can't call it this. there already is a rule fo this GetCollectionResponseSchema.ts

export const getCollectionResponseSchema = (properties: any, _opts: any, ctx: any) => {
  if (!properties || typeof properties !== "object") {
    return []
  }
  const keys = Object.keys(properties)

  if (keys.length > 2 || keys.some((key) => !ALLOWED_KEYS.includes(key))) {
    return [
      {
        message: ERROR_MESSAGE,
      },
    ]
  }
  return []
}
