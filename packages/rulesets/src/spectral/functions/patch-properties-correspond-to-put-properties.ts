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
  // array of all the patch body parameters
  const patchBodyParameters: any[] = pathItem["patch"]?.parameters?.filter(PARAM_IN_BODY)
  // array of all the put body parameters
  const putBodyParameters: any[] = pathItem["put"]?.parameters?.filter(PARAM_IN_BODY)

  // neither patch nor put present => ignore
  if (!patchBodyParameters && !putBodyParameters) {
    return []
  }
  // patch present but put not present or there are no patch body parameters => error
  if ((patchBodyParameters && !putBodyParameters) || patchBodyParameters?.length < 1) {
    return error
  }

  // array of all the patch body parameters that are not present in the put body (if any)
  const patchBodyParametersNotInPutBody = _.differenceWith(patchBodyParameters, putBodyParameters, _.isEqual)

  // there is at least one parameter present in the patch body that is not present in the the put body
  if (patchBodyParametersNotInPutBody.length > 0) {
    return error
  }

  return []
}
