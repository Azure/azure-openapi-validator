import { findNodeAtLocation, getNodeValue, JSONPath, Node, parseTree } from "jsonc-parser"
import { isNumber } from "util"

type Location = {
  line: number
  column: number
}

export interface JsonInstance {
  getLocation(path: JSONPath): Location
  getValue(): any
}

export interface IJsonParser {
  parse(text: string): JsonInstance
}

export class JsonParser implements IJsonParser {
  parse(text: string) {
    const errors = []
    const rootNode = parseTree(text, errors, { disallowComments: true })
    if (errors.length || rootNode == undefined) {
      throw new Error("Parser failed with errors:" + JSON.stringify(errors))
    }
    return {
      getLocation: (path: JSONPath) => {
        // JSONPath does not include the root '$', replace number string to number
        path = path.map(v => Number.isNaN(+v)?v: Number.parseInt(v as string) )
        const root = findNodeAtLocation(rootNode, path)
        return getLocation(text, root)
      },
      getValue: () => {
        return Object.assign({}, getNodeValue(rootNode))
      }
    }
  }
}
function getLocation(text: string, node: Node) {
  let line = 1
  let column = 0
  if (!node) {
    return undefined
  }
  for (let i = 0; i < node.offset; i++) {
    if (text[i] === "\n") {
      line++
      column = 0
    }
    column++
  }
  return {
    line,
    column
  }
}
