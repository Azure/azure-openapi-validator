//This rule applies when the default value specified by the property
//does not appear in the enum constraint for a schema.
const defaultInEnum = (swaggerObj: any, _opts: any, paths: any) => {
  const defaultValue = swaggerObj.default
  const enumValue: string[] = swaggerObj.enum
  if (
    swaggerObj === null ||
    typeof swaggerObj !== "object" ||
    !defaultValue === null ||
    defaultValue === undefined ||
    enumValue === null ||
    enumValue === undefined
  ) {
    return []
  }

  if (!Array.isArray(enumValue)) {
    return []
  }
  const path = paths.path || []

  if (enumValue && !enumValue.includes(defaultValue)) {
    return [
      {
        message: "Default value should appear in the enum constraint for a schema.",
        path,
      },
    ]
  }

  return []
}

export default defaultInEnum
