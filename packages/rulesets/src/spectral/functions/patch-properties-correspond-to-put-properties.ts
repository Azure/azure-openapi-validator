// Validates that each patch request body contains one or more properties present in the corresponding put request body,
// and contains only properties present in the put request body.
// RPC Code: RPC-Patch-V1-01

import _ from "lodash"
import { getAllPropertiesIncludingDeeplyNestedProperties } from "./utils"

const ERROR_MESSAGE =
  "A patch request body must only contain properties present in the corresponding put request body, and must contain at least one of the properties."
const PARAM_IN_BODY = (paramObject: any) => paramObject.in === "body"
const PATCH = "patch"
const PUT = "put"
const PARAMETERS = "parameters"

export const patchPropertiesCorrespondToPutProperties = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object" || pathItem[PATCH] === undefined || pathItem[PUT] === undefined) {
    return []
  }

  const path = ctx.path.concat([PATCH, PARAMETERS])
  const errors: any = []

  // array of all the patch body param properties
  // let patchBodyPropertiesList: any = []
  // let putBodyPropertiesList: any = []
  const patchBodyProperties: any[] = pathItem[PATCH]?.parameters
    ?.filter(PARAM_IN_BODY)
    .map((param: any) => getAllPropertiesIncludingDeeplyNestedProperties(param.schema, []))
  const putBodyProperties: any[] = pathItem[PUT]?.parameters
    ?.filter(PARAM_IN_BODY)
    .map((param: any) => getAllPropertiesIncludingDeeplyNestedProperties(param.schema, []))

  const patchBodyPropertiesEmpty: boolean = patchBodyProperties?.length < 1
  const putBodyPropertiesEmpty: boolean = putBodyProperties?.length < 1

  //patch without at least one body properties => error
  if (patchBodyPropertiesEmpty) {
    return [
      {
        message: "Patch operations body cannot be empty.",
        path: path,
      },
    ]
  }

  //patch body nonempty while put body empty => error
  if (!patchBodyPropertiesEmpty && putBodyPropertiesEmpty) {
    return [
      {
        message: "Non empty patch body with an empty put body is not valid.",
        path: path,
      },
    ]
  }

  // array of all the patch body properties that are not present in the put body (if any)
  //considering only the first element of patchBodyProperties & putBodyProperties is because there will only be one body param
  const patchBodyPropertiesNotInPutBody = _.differenceWith(patchBodyProperties[0], putBodyProperties[0], _.isEqual)
  // there is at least one property present in the patch body that is not present in the the put body => error
  if (patchBodyPropertiesNotInPutBody?.length > 0) {
    patchBodyPropertiesNotInPutBody.forEach((missingProperty) =>
      errors.push({
        message: `${Object.keys(missingProperty)[0]} property in patch body is not present in the corresponding put body. ` + ERROR_MESSAGE,
        path: path,
      })
    )
    return errors
  }

  return []
}
