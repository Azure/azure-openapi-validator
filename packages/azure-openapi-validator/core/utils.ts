import { fileURLToPath, pathToFileURL } from "url"
import { IDocumentDependencyGraph } from "./types"
import { nodes, stringify } from "./jsonpath"
import _ from "lodash"
/**
 *
 * @param doc
 * @param schema
 * @param graph
 * @returns the schema that the reference pointed to, this will not de-reference the child item of this reference.
 */
export function followReference(doc: any, schema: any, graph?: IDocumentDependencyGraph) {
  const getRefModel = (refValue: string, visited: string[]) => {
    if (visited.includes(refValue)) {
      throw new Error("Found circle reference: " + visited.join("->"))
    }
    visited.push(refValue)
    const refSlices = parseJsonRef(refValue)
    const pathExpression = refSlices[1].split("/").slice(1)
    try {
      const result = nodes(doc, stringify(["$", ...pathExpression]))
      return result.length !== 0 ? result[0].value : undefined
    } catch (err) {
      throw err
    }
  }

  if (schema && doc) {
    if (schema.$ref) {
      const refSlices = parseJsonRef(schema.$ref)
      if (graph && refSlices[0]) {
        doc = graph.getDocument(refSlices[0]).getObj()
      }
      schema = getRefModel(`#${refSlices[1]}`, [])
      return followReference(doc, schema, graph)
    }
    return schema
  }
  return undefined
}

export const normalizePath = (path: string) => {
  let urlPath = fileURLToPath(pathToFileURL(path)).replace(/\\/g, "/")
  if (urlPath.slice(1, 3) === ":/") {
    // for windows
    return urlPath.charAt(0).toUpperCase() + urlPath.slice(1)
  }
  return urlPath
}

export const parseJsonRef = (ref: string): string[] => {
  return ref.split("#")
}

export function traverse(obj: unknown, path: string[], visited: Set<any>, options: any, visitor: (obj, path, context) => boolean) {
  if (!obj) {
    return undefined
  }
  if (visited.has(obj)) {
    return
  }
  visited.add(obj)

  if (visitor(obj, path, options) === false) {
    return
  }

  if (Array.isArray(obj)) {
    for (const [index, item] of obj.entries()) {
      traverse(item, [...path, index.toString()], visited, options, visitor)
    }
  } else if (typeof obj === "object") {
    for (const [key, item] of Object.entries(obj!)) {
      traverse(item, [...path, key], visited, options, visitor)
    }
  }
}

export function isExample(path: string) {
  return path.split(/\\|\//g).includes("examples")
}
