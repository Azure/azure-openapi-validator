/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const $RefParser = require("@apidevtools/json-schema-ref-parser")
import { nodes, stringify } from "jsonpath"
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
    return await parser.dereference(docCopy)
  } catch (err) {
    console.error(err)
  }
}

export async function getResolvedSchemaByPath(schemaPath: JsonPath, doc: any): Promise<object | undefined> {
  const resolvedJson = await getResolvedJson(doc)
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
    console.error(err)
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
  const pascalCase: RegExp = new RegExp(`^[A-Z][a-z0-9]+\.([A-Z]+[a-z0-9]+)+$`)
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
