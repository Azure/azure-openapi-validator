// Synchronous DELETE must have 200 & 204 return codes and LRO DELETE must have 202 & 204 return codes.
// RPC Code: RPC-Delete-V1-01

const SYNC_DELETE_RESPONSES = ["200", "204", "default"]
const LR_DELETE_RESPONSES = ["202", "204", "default"]

export const DeleteResponseCodes = (deleteOp: any, _opts: any, ctx: any) => {
  if (deleteOp === null || typeof deleteOp !== "object") {
    return []
  }
  const path = ctx.path
  const errors = []

  if (!deleteOp?.responses) {
    return []
  }

  const responses = Object.keys(deleteOp?.responses ?? {})

  if (deleteOp["x-ms-long-running-operation"] === true) {
    if (responses.length !== LR_DELETE_RESPONSES.length || !LR_DELETE_RESPONSES.every((value) => responses.includes(value))) {
      errors.push({
        message: "Long-running (LRO) delete operations must have responses with 202 and 204 return codes, and no other response codes.",
        path: path,
      })
    }
  } else {
    if (responses.length !== SYNC_DELETE_RESPONSES.length || !SYNC_DELETE_RESPONSES.every((value) => responses.includes(value))) {
      errors.push({
        message: "Synchronous delete operations must have responses with 200 and 204 return codes, and no other response codes.",
        path: path,
      })
    }
  }

  return errors
}
