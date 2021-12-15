import { Message } from "../jsonrpc/types"

export function sendMessage(msg: Message) {
  const jsonMsg = {
    sources: msg.Source[0].document,
    code: msg.Key[1],
    jsonpath: msg.Source[0].Position,
    message: msg.Details,
    severity: msg.Channel
  }
  console.log(JSON.stringify(jsonMsg, null, 2))
}
