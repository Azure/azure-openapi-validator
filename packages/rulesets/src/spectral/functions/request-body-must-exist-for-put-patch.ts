import { isEmpty } from "lodash"

export const requestBodyMustExistForPutPatch = (putPatchOperationParameters: any, _opts: any, ctx: any) => {
  const errors = []
  const path = ctx.path
  const error = `The put or patch operation does not have a request body defined. This is not allowed. Please specify a request body for this operation.`

  const bodyParam = findBodyParam(putPatchOperationParameters)

  // Throw an error under various conditions where the schema of the request body may be undefined
  if (
    bodyParam == undefined ||
    bodyParam["schema"] == undefined ||
    isEmpty(bodyParam["schema"])
  ) {
    errors.push({
      message: error,
      path: path,
    })
  }

  return errors
}

function findBodyParam(params: any) {
  const isBody = (elem: any) => elem.name === "body" && elem.in === "body"
  if (params && Array.isArray(params)) {
    return params.filter(isBody).shift()
  }
  return undefined
}
