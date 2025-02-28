export const lroAzureAsyncOperationHeader = (headers: any, _opts: any, ctx: any) => {
  if (headers) {
    if (headers === null || !Object.keys(headers).includes("Azure-AsyncOperation")) {
      return [
        {
          message: "All long-running operations must include an `Azure-AsyncOperation' response header.",
          path: ctx.path,
        },
      ]
    }
  }
  return []
}
