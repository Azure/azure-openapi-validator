# ExtensionResourcePathPattern

## Category

RPaaS Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The path '{api path}' which is for extension routing resource type, shouldn't include the parent scope.

## Description

Path (operation) for 'extension routing type' (that has additional /providers/ segment in parent scope) must be of the form '{scope}/provider/RPNamespace/resourceTypeName' (shouldn't include parent scope)

## CreatedAt

November 8, 2021

## LastModifiedAt

November 8, 2021

## Why this rule is important

The parent scope won't be passed over to PRaaS, and the API will fail in RPaaS validation.

## How to fix the violation

Move the parent resource URI to the 'scope' parameter which is string type.

The following would be invalid:

```json
"/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/{providerNamespace}/{resourceType}/{resourceName}/providers/Microsoft.MyProvider/defenderSettings/default"
```

The following would be valid :

```json
"{scope}/providers/Microsoft.MyProvider/defenderSettings/default"
```
