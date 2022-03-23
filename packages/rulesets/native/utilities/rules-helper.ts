/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const matchAll = require("string.prototype.matchall")
import { ISwaggerInventory } from "@microsoft.azure/openapi-validator-core"
import * as JSONPath from "jsonpath-plus"

import { followReference } from "./ref-helper"

export function getSuccessfulResponseSchema(node:any, doc:any, inventory?: ISwaggerInventory): any {
  if (!node.responses) {
    return undefined
  }
  const responses = Object.keys(node.responses)
  const response = getMostSuccessfulResponseKey(responses)
  return getResponseSchema(node.responses[response], doc, inventory)
}

export function getMostSuccessfulResponseKey(responses: string[]): string {
  let response = "default"
  if (responses.includes("200")) {
    response = "200"
  } else {
    const twoHundreds :string[] = []
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

export function getResponseSchema(response: object, doc:any, inventory?: ISwaggerInventory): any {
  let schema = (response as any).schema
  if (schema === undefined || schema === null) {
    return
  }
  if ("$ref" in schema) {
    schema = followReference(doc, schema, inventory)
  }
  return schema.properties
}

export function getAllResourceProvidersFromPath(path: string): string[] {
  const resourceProviderRegex = new RegExp(/providers\/([\w\.]+)/, "g")
  return Array.from(matchAll(path, resourceProviderRegex), (m:any) => m[1])
}

export function getAllWordsFromPath(path: string): string[] {
  const wordRegex = new RegExp(/([\w\.]+)/, "g")
  return Array.from(matchAll(path, wordRegex), (m:any) => m[1])
}

export function resourceProviderMustPascalCase(resourceProvider: string): boolean {
  if (resourceProvider.length === 0) {
    return false
  }
  // refer https://docs.microsoft.com/en-us/previous-versions/dotnet/netframework-1.1/141e06ef(v=vs.71)?redirectedfrom=MSDN
  const pascalCase = new RegExp(`^[A-Z][a-z0-9]+(\.([A-Z]{1,3}[a-z0-9]+)+[A-Z]{0,2})+$`)
  return pascalCase.test(resourceProvider)
}

export function resourceTypeMustCamelCase(resourceType: string): boolean {
  if (resourceType.length === 0) {
    return true
  }
  const pascalCase = new RegExp("^[a-z][a-z0-9]+([A-Z]+[a-z0-9]*)*$")
  return pascalCase.test(resourceType)
}

export function isValidOperation(operation: string): boolean {
  const validOperations = ["put", "get", "patch", "post", "head", "options", "delete"]
  return validOperations.indexOf(operation.toLowerCase()) !== -1
}

export function isValidEnum(node:any) {
  if (!node || !node.type || typeof node.type !== "string") {
    return false
  }
  return ["boolean", "integer", "number", "string"].indexOf(node.type) !== -1 && Array.isArray(node.enum)
}

export function transformEnum(type: string, enumEntries:any) {
  return enumEntries.map((v:any) => {
    if (v === null) {
      return ""
    }
    return v.toString()
  })
}

export function getResolvedSchemaByPath(doc: any, path: string[], inventory?: ISwaggerInventory) {
  const result = nodes(doc, stringify(path))
  if (result && result.length) {
    return followReference(doc, result[0].value, inventory)
  }
}


export function nodes(obj: any, pathExpression: string) {
  const result = JSONPath.JSONPath({ json: obj, path: pathExpression, resultType: "all" })
  return result.map((v:any) => ({ path: JSONPath.JSONPath.toPathArray(v.path), value: v.value, parent: v.parent }))
}

export function stringify(path: string[]) {
  const pathWithRoot = ["$", ...path]
  return JSONPath.JSONPath.toPathString(pathWithRoot)
}
