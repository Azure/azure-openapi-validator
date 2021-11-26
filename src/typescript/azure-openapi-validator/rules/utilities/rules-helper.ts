/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const $RefParser = require("@apidevtools/json-schema-ref-parser")
import { apply, nodes, stringify } from "jsonpath"
import { JsonPath } from "../../../jsonrpc/types"
import { resolveNestedSchema } from "./resolveNestedSchema"
const matchAll = require("string.prototype.matchall")

export function getSuccessfulResponseSchema(node, doc): any {
  const responses = Object.keys(node.responses)
  const response = getMostSuccessfulResponseKey(responses)
  return getResponseSchema(node.responses[response], doc)
}

export function getMostSuccessfulResponseKey(responses: string[]): string {
  let response: string = "default"
  if (responses.includes("200")) {
    response = "200"
  } else {
    const twoHundreds = []
    responses.forEach(function(value) {
      if (value.startsWith("2")) {
        twoHundreds.push(value)
      }
    })
    if (twoHundreds.length > 0) {
      response = twoHundreds[0]
    }
  }
  return response
}

export function getResponseSchema(response: object, doc): any {
  const schema = (response as any).schema
  if (schema === undefined || schema === null) {
    return
  }
  if ("$ref" in schema) {
    const schemaRef = schema.$ref
    const schemaPath: string[] = (schemaRef as string).split("/")
    const schemaProperties = doc.definitions[schemaPath[2]].properties
    return schemaProperties
  }
  return schema.properties
}

/**
 * return a dereferenced json, also will resolve the circular $refs
 */
export async function getResolvedJson(doc: any): Promise<object | undefined> {
  try {
    const parser = new $RefParser()
    const docCopy = JSON.parse(JSON.stringify(doc))
    /*
     * remove x-ms-examples
     */
    apply(docCopy, `$..['x-ms-examples']`, e => null)
    return await parser.dereference(docCopy)
  } catch (err) {
    return
  }
}

export async function getResolvedSchemaByPath(schemaPath: JsonPath, doc: any): Promise<object | undefined> {
  const resolvedJson = await getResolvedJson(doc)
  if (!resolvedJson) {
    return undefined
  }
  const pathExpression = stringify(schemaPath)
  const result = nodes(resolvedJson, pathExpression)
  if (!result) {
    return undefined
  }
  const schema = result[0].value
  return getResolvedResponseSchema(schema)
}

/*
 * resolve the `allOf` and `properties` keywords in the schema
 * return a flatted json
 */
export async function getResolvedResponseSchema(schema: object): Promise<object | undefined> {
  if (!schema) {
    return
  }
  try {
    return resolveNestedSchema(schema)
  } catch (err) {
    return
  }
}

export function getAllResourceProvidersFromPath(path: string): string[] {
  const resourceProviderRegex: RegExp = new RegExp(/providers\/([\w\.]+)/, "g")
  return Array.from(matchAll(path, resourceProviderRegex), m => m[1])
}

export function getAllWordsFromPath(path: string): string[] {
  const wordRegex: RegExp = new RegExp(/([\w\.]+)/, "g")
  return Array.from(matchAll(path, wordRegex), m => m[1])
}

export function resourceProviderMustPascalCase(resourceProvider: string): boolean {
  if (resourceProvider.length === 0) {
    return false
  }
  // refer https://docs.microsoft.com/en-us/previous-versions/dotnet/netframework-1.1/141e06ef(v=vs.71)?redirectedfrom=MSDN
  const pascalCase: RegExp = new RegExp(`^[A-Z][a-z0-9]+(\.([A-Z]{1,3}[a-z0-9]+)+[A-Z]{0,2})+$`)
  return pascalCase.test(resourceProvider)
}

export function resourceTypeMustCamelCase(resourceType: string): boolean {
  if (resourceType.length === 0) {
    return true
  }
  const pascalCase: RegExp = new RegExp("^[a-z][a-z0-9]+([A-Z]+[a-z0-9]*)*$")
  return pascalCase.test(resourceType)
}

export function isValidOperation(operation: string): boolean {
  const validOperations = ["put", "get", "patch", "post", "head", "options", "delete"]
  return validOperations.indexOf(operation.toLowerCase()) !== -1
}

export function isValidEnum(node) {
  if (!node || !node.type || typeof node.type !== "string") {
    return false
  }
  return ["boolean", "integer", "number", "string"].indexOf(node.type) !== -1 && Array.isArray(node.enum)
}

export function transformEnum(type: string, enumEntries) {
  return enumEntries.map(v => {
    if (v === null) {
      return ""
    }
    return v.toString()
  })
}

export function deReference(doc: any, schema: any) {
  const getRefModel = (refValue: string, visited: string[]) => {
    if (visited.includes(refValue)) {
      throw new Error("Found circle reference: " + visited.join("->"))
    }
    visited.push(refValue)
    const pathExpression = refValue.replace(/^#\//, "").split("/")
    try {
      const result = nodes(doc, stringify(pathExpression))
      return result.length !== 0 ? result[0].value : undefined
    } catch (err) {
      throw err
    }
  }
  if (schema && doc) {
    if (schema.$ref) {
      return getRefModel(schema.$ref, [])
    }
    return schema
  }
  return undefined
}
