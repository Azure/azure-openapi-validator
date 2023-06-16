// Validates that each patch request body contains one or more properties present in the corresponding put request body,
// and contains only properties present in the put request body.
// RPC Code: RPC-Patch-V1-01

import _ from "lodash"
import { getProperties } from "./utils"

const ERROR_MESSAGE =
  "A patch request body must only contain properties present in the corresponding put request body, and must contain at least one of the properties."
const PARAM_IN_BODY = (paramObject: any) => paramObject.in === "body"
const PATCH = "patch"
const PUT = "put"
const PARAMETERS = "parameters"
const PROPERTIES = "properties"

export const patchPropertiesCorrespondToPutProperties = (pathItem: any, _opts: any, ctx: any) => {
  if (pathItem === null || typeof pathItem !== "object") {
    return []
  }

  const path = ctx.path.concat([PATCH, PARAMETERS])
  const error = [{ message: ERROR_MESSAGE, path: path }]
  const errors: any = []

  // array of all the patch body param properties
  const patchBodyProperties: any[] = pathItem[PATCH]?.parameters?.filter(PARAM_IN_BODY).map((param: any) => getProperties(param.schema))
  // array of all the put body param properties
  const putBodyProperties: any[] = pathItem[PUT]?.parameters?.filter(PARAM_IN_BODY).map((param: any) => getProperties(param.schema))

  const patchBodyPropertiesEmpty = patchBodyProperties.length < 1
  const putBodyPropertiesEmpty = putBodyProperties.length < 1 

  //patch without at least one body properties => error
  if (patchBodyPropertiesEmpty) {
    return [
      {
        message: "Patch operations body cannot be empty.",
        path: path,
      },
    ]
  }

  // patch body is empty while put body nonempty
  // or patch body nonempty while put body empty => error
  if (patchBodyPropertiesEmpty != putBodyPropertiesEmpty) {
    return error
  }

  // array of all the patch body properties that are not present in the put body (if any)
  const patchBodyPropertiesNotInPutBody = _.differenceWith(patchBodyProperties, putBodyProperties, _.isEqual)

  // there is at least one property present in the patch body that is not present in the the put body => error
  if (patchBodyPropertiesNotInPutBody.length > 0) {
    patchBodyPropertiesNotInPutBody.forEach((missingProperty) =>
      Object.keys(missingProperty).forEach((key) => {
        errors.push({
          message: `${key} property in patch body is not present in the corresponding put body.` + ERROR_MESSAGE,
          path: path.concat([PROPERTIES, key]),
        })
      })
    )
    return errors
  }

  return []
}
