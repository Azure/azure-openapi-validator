const xmsPageableForGetListCalls = (swaggerObj: any, _opts: any, paths: any) => {
  if (swaggerObj === null) {
    return []
  }
  const path = paths.path || []

  if (swaggerObj["x-ms-pageable"]) return []
  else
    return [
      {
        message: "For all LIST APIs (a.k.a collection GETs), it is important to include the `x-ms-pageable` property.",
        path: path,
      },
    ]
}

export default xmsPageableForGetListCalls
