import { findNodeAtLocation, getNodeValue, JSONPath, Node, parseTree } from "jsonc-parser"
import { Range } from "./types"

export interface JsonInstance {
  getLocation(path: JSONPath): Range
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
        let targetPath = [...path]
        while (targetPath.length > 0) {
          const correctedPath = targetPath.map(v => (Number.isNaN(+v) ? v : Number.parseInt(v as string)))
          const root = findNodeAtLocation(rootNode, correctedPath)
          if (root) {
            return getRange(text, root)
          }
          targetPath.pop()
        }
        throw new Error("Invalid Path")
      },
      getValue: () => {
        return Object.assign({}, getNodeValue(rootNode))
      }
    }
  }
}
function getLocation(text: string, offset: number) {
  let line = 1
  let column = 0

  for (let i = 0; i < offset; i++) {
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

function getRange(text: string, node: Node) {
  return {
    start: getLocation(text, node.offset),
    end: getLocation(text, node.offset + node.length)
  }
}
