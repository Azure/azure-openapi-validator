export const responseSchemaSpecifiedForSuccessStatusCode = (putOperation: any, _opts: any, ctx: any) => {
  const errors = []
  const path = ctx.path
  const successCodes = ["200", "201"]

  for (const code of successCodes) {
    if (putOperation.responses[code]) {
      const response = putOperation.responses[code]
      if (!response?.schema) {
        errors.push({
          message: `The ${code} success status code has missing response schema. 200 and 201 success status codes for an ARM PUT operation must have a response schema specified.`,
          path,
        })
      }
    }
  }

  return errors
}

export default responseSchemaSpecifiedForSuccessStatusCode
