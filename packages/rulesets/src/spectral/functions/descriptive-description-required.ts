//The value of the 'description' property must be descriptive. It cannot be spaces or empty description.
const descriptiveDescriptionRequired = (swaggerObj:any, _opts:any, paths:any) => {
  if (swaggerObj === null || typeof swaggerObj !== "string") {
    return [];
  }
  if (swaggerObj.trim().length != 0) {
    return [];
  }
  const path = paths.path || [];
  return [{
    message: 'The value provided for description is not descriptive enough. Accurate and descriptive description is essential for maintaining reference documentation.',
    path,
  }];
};

export default descriptiveDescriptionRequired
