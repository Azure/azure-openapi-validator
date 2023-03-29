// Verifies that collection get schemas have only the `value` and `nextLink` properties in their models.

export const getCollectionOnlyHasValueAndNextLink = (properties: any, _opts: any, ctx: any) => {
  if (!properties || typeof properties !== "object") {
    return []
  }
  const keys = Object.keys(properties)

  if (keys.length != 2 || !keys.includes("value") || !keys.includes("nextLink")) {
    return [
      {
        message: "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model.",
      },
    ]
  }
  return []
}
