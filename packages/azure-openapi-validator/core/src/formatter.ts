// @ts-nocheck
import { Message } from "./types"
import { SwaggerInventory } from "./swaggerInventory"
import { stringify } from "./jsonpath"
import { LintResultMessage } from "."

export interface IFormatter<T> {
  format: (msg: Message | Message[]) => T[]
}

export class JsonFormatter implements IFormatter<LintResultMessage> {
  constructor(private inventory: SwaggerInventory) {}
  format(message: Message | Message[]) {
    const outputs = []
    const msgs = Array.isArray(message) ? message : [message]
    for (const msg of msgs) {
      const document = this.inventory.getDocument(msg?.Source[0]?.document)
      let path = msg?.Source[0]?.jsonPath
      if (path && path[0] === "$") {
        path = path.slice(1)
      }
      const range = document.getPositionFromJsonPath(path)

      const jsonMsg = {
        ...msg.Details,
        sources: [msg.Source[0].document],
        jsonpath: stringify(path as string[]),
        location: range.start,
        range
      }
      outputs.push(jsonMsg)
    }
    return outputs
  }
}
