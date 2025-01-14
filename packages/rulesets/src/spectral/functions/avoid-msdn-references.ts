//The documentation is being generated from the OpenAPI(swagger) and published at "docs.microsoft.com".
//From that perspective, documentation team would like to avoid having links to the "msdn.microsoft.com" in the OpenAPI(swagger) and SDK documentations.
//For better generated code quality, remove all references to "msdn.microsoft.com".
const avoidMsdnReferences = (swaggerObj:any, _opts:any, paths:any) => {
  if (swaggerObj === null) {
    return [];
  }
  if (typeof swaggerObj === "string" && !(swaggerObj.includes("https://msdn.microsoft.com") || swaggerObj.includes("https://docs.microsoft.com")))
    return [];
  if (typeof swaggerObj === "object") {
    const docUrl: string = swaggerObj.url;
    if (docUrl === undefined || !(docUrl.startsWith("https://msdn.microsoft.com") || docUrl.startsWith("https://docs.microsoft.com")))
      return [];
  }
  const path = paths.path || [];
  return [{
    message: 'For better generated code quality, remove all references to "msdn.microsoft.com" and "docs.microsoft.com".',
    path,
  }];
};

export default avoidMsdnReferences
