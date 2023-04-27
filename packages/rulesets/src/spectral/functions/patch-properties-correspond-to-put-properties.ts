import _ from "lodash"

const PARAM_IN_BODY = (paramObject: any) => paramObject.in === "body"

export const patchPropertiesCorrespondToPutProperties = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }

  const error = [
    {
      message:
        "A patch request body must only contain properties present in the corresponding put request body, and must contain at least one of the properties.",
      path: ctx.path,
    },
  ]
  const patchBodyParameters: any[] = pathItem["patch"]?.parameters?.filter(PARAM_IN_BODY)
  const putBodyParameters: any[] = pathItem["put"]?.parameters?.filter(PARAM_IN_BODY)

  // neither patch nor put present => ignore
  if (!patchBodyParameters && !putBodyParameters) {
    return []
  }
  // patch present but put not present => error
  if (patchBodyParameters && !putBodyParameters) {
    return error
  }

  const patchBodyParametersNotInPutBody = _.differenceWith(patchBodyParameters, putBodyParameters, _.isEqual)

  if (patchBodyParametersNotInPutBody.length > 0) {
    return error
  }

  return []
}
