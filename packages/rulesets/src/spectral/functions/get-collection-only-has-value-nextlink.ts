// Verifies that collection get schemas have only the `value` and `nextLink` properties in their models.

// These if conditions checks each path if it has any static strings defined by customer and skips that path
export const getCollectionOnlyHasValueAndNextLink = (prop: any, _opts: any, ctx: any) => {
  for (let path of ctx.path) {
    if (path.includes(".")) {
      // Splitting the path by Provider namespace
      let splitNamespace = path.split(".")
      // finding number of segments after namespace
      if (path.includes("/")) {
        let segments = splitNamespace[1].split("/")
        if (segments.length % 2 !== 0) {
          return []
        } else {
          const key = Object.keys(prop)
          if (key.length != 2 || !key.includes("value") || !key.includes("nextLink")) {
            return [
              {
                message: "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model.",
              },
            ]
          }
        }
      }
    }
  }
  return []
}
