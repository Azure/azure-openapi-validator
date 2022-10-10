# DefinitionsPropertiesNamesCamelCase

## Category

ARM Error

## Applies to

ARM and Data Plane OpenAPI(swagger) specs

## Output Message

Property named: "{0}", must follow camelCase style. Example: "{1}".
## Output Message

Property named: "{0}", for definition: "{1}" must follow camelCase style. Example: "{2}".

## Description

Property names must use lowerCamelCase style.
If the property is a single word (ex: foo, bar, etc.) it will be all lowercase. 
Two-letter acronyms (ex: ID, IO, IP, etc.) should be capitalized. 
Three-letter acronyms (ex: API, URL, etc.) should only have the first letter capitalized (ex: Api, Url, etc.) 
For more capitalization guidance, see: [https://msdn.microsoft.com/en-us/library/141e06ef(v=vs.71).aspx](https://msdn.microsoft.com/en-us/library/141e06ef(v=vs.71).aspx)

## Why the rule is important

Per [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), properties should follow camel case format as specified at [https://msdn.microsoft.com/en-us/library/141e06ef(v=vs.71).aspx](https://msdn.microsoft.com/en-us/library/141e06ef(v=vs.71).aspx).

## How to fix the violation

Adopt camel case format as indicated by the rule. Please note that this may require a service side update and may cause a breaking change.

## Impact on generated code

Serialization of the property by the SDK will follow casing as defined in the spec file. Make sure casing matches the service implementation.

## Good Examples

Examples of lowerCamelCase style:
* camelCase
* foo
* bar
* fooBarBaz
* resourceKey
* resourceApiKey
* publicIPAddress
* enableSsl

## Bad Examples

The following would be invalid:
* PascalCase
* UpperCamelCase
* resourceAPIKey
* enableSSL

## Bad Examples

The following violate these guidelines but would not be caught by automation:
* alllowercase - If there are multiple words, please capitalize starting with the second word
* miXeDcApItAlIzAtIoN - Please capitalize the first letter of each word (and not seemingly random letters)
* resourceAPIkey - Automation would incorrectly recognize "Ikey" as a word and not flag the property name
