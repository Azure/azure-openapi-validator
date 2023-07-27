export const PutResponseSchemaDescription: any = (putResponseSchema: any, opts: any, ctx: any) => {
  if (putResponseSchema === null || typeof putResponseSchema !== "object") {
    return []
  }

  const path = ctx.path
  const errors = []

  if (!putResponseSchema["200"] || !putResponseSchema["201"]) {
    errors.push({
      message: "Any Put MUST contain 200 and 201 return codes.",
      path: path,
    })
    return errors
  }

  if (!putResponseSchema["200"].description?.toLowerCase().includes("replace")) {
    errors.push({
      message: 'Description of 200 response code of a PUT operation MUST include term "replace".',
      path: path,
    })
  }

  if (!putResponseSchema["201"].description?.toLowerCase().includes("create")) {
    errors.push({
      message: 'Description of 201 response code of a PUT operation MUST include term "create".',
      path: path,
    })
  }

  return errors
}
