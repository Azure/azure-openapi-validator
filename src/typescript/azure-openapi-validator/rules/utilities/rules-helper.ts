/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const matchAll = require("string.prototype.matchall")
import { DocumentDependencyGraph } from "../../depsGraph"
import { stringify, nodes } from "../../jsonpath"
import { deReference } from "../../swaggerUtils"

export function getSuccessfulResponseSchema(node, doc, graph: DocumentDependencyGraph): any {
  if (!node.responses) {
    return undefined
  }
  const responses = Object.keys(node.responses)
  const response = getMostSuccessfulResponseKey(responses)
  return getResponseSchema(node.responses[response], doc, graph)
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

export function getResponseSchema(response: object, doc, graph: DocumentDependencyGraph): any {
  let schema = (response as any).schema
  if (schema === undefined || schema === null) {
    return
  }
  if ("$ref" in schema) {
    schema = deReference(doc, schema, graph)
  }
  return schema.properties
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

export function getResolvedSchemaByPath(doc: any, path: string[], graph: DocumentDependencyGraph) {
  const result = nodes(doc, stringify(path))
  if (result && result.length) {
    return deReference(doc, result[0].value, graph)
  }
}
