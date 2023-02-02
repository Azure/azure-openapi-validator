import { getReturnedSchema, isXmsResource } from "./utils"

export const withXmsResource = (putOperation: any, _opts: any, ctx: any) => {
  const errors = []
  const path = ctx.path

  const returnSchema = getReturnedSchema(putOperation)
  if (returnSchema && !isXmsResource(returnSchema)) {
    errors.push({
      message: `The 200 response model for an ARM PUT operation must have x-ms-azure-resource extension set to true in its hierarchy.Operation: ${putOperation.operationId}`,
      path,
    })
  }
  return errors
}
export default withXmsResource
