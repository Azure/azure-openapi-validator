const xmsPageableForListCalls = (swaggerObj: any, _opts: any, paths: any) => {
  if (swaggerObj === null) {
    return []
  }
  const path = paths.path || []

  if (swaggerObj["x-ms-pageable"]) return []
  else
    return [
      {
        message: "`x-ms-pageable` extension must be specified for LIST APIs.",
        path: path,
      },
    ]
}

export default xmsPageableForListCalls
