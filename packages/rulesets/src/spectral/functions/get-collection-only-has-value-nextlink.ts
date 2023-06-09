// Verifies that collection get schemas have only the `value` and `nextLink` properties in their models.

export const getCollectionOnlyHasValueAndNextLink = (prop: any, _opts: any, ctx: any) => {
  for (let path of ctx.path) {
    if (path.includes(".")) {
      // Splitting the path by Provider namespace
      let splitNamespace = path.split(".")
      // finiding number of segments after namespace
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
