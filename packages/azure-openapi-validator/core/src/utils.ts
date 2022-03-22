import { ISwaggerInventory, OpenApiTypes,JsonPath } from "./types"
import { nodes, stringify } from "./jsonpath"
import _ from "lodash"
import { readFileSync } from "fs"
import { resolveUri } from "@azure-tools/uri";
/**
 *
 * @param doc
 * @param schema
 * @param inventory
 * @returns the schema that the reference pointed to, this will not de-reference the child item of this reference.
 */
export function followReference(doc: any, schema: any, inventory?: ISwaggerInventory):any {
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
      if (inventory && refSlices[0]) {
        doc = inventory.getDocument(refSlices[0]).getObj()
      }
      schema = getRefModel(`#${refSlices[1]}`, [])
      return followReference(doc, schema, inventory)
    }
    return schema
  }
  return undefined
}

export function isUriAbsolute(url:string) {
    return /^[a-z]+:\/\//.test(url);
}

export const normalizePath = (path: string) => {
   return resolveUri(path,"")
}

export const parseJsonRef = (ref: string): string[] => {
  return ref.split("#")
}

export function traverse(obj: unknown, path: string[], visited: Set<any>, options: any, visitor: (obj:any, path:string[], context:any) => boolean) {
  if (!obj) {
    return
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
  return
}

export function isExample(path: string) {
  return path.split(/\\|\//g).includes("examples")
}

export function getOpenapiType(type: string) {
  switch (type) {
    case "arm": {
      return OpenApiTypes.arm
    }
    case "data-plane": {
      return OpenApiTypes.dataplane
    }
    case "rpaas": {
      return OpenApiTypes.rpaas
    }
    case "providerHub": {
      return OpenApiTypes.rpaas
    }
    default:
      return OpenApiTypes.default
  }
}

export const defaultFileSystem = {
  read:(uri:string)=>{
      return readFileSync(uri).toString()
    }
}

export function getRange(inventory:ISwaggerInventory,specPath:string,path:JsonPath) {
  const document = inventory.getDocument(specPath)
  if (path && path[0] === "$") {
    path = path.slice(1)
  }
  return document.getPositionFromJsonPath(path)
}

export function convertJsonPath(path:string[]) {
  return path.map(v => (Number.isNaN(+v) ? v : Number.parseInt(v as string)))
}