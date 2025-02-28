export const lroAzureAsyncOperationHeader = (headers: any, _opts: any, ctx: any) => {
  if (!Object.keys(headers).includes("headers") || !Object.keys(headers.headers).includes("Azure-AsyncOperation")) {
    return [
      {
        message: "All long-running operations must include an `Azure-AsyncOperation' response header.",
        path: ctx.path.concat("headers"),
      },
    ]
  }
  return []
}
