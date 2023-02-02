//To check if a filtered module is null.
const enumInsteadOfBoolean = (swaggerObj: any, _opts: any, paths: any) => {
  if (swaggerObj === null) {
    return []
  }
  const path = paths.path || []

  return [
    {
      message:
        "Booleans properties are not descriptive in all cases and can make them to use, evaluate whether is makes sense to keep the property as boolean or turn it into an enum.",
      path,
    },
  ]
}

export default enumInsteadOfBoolean
