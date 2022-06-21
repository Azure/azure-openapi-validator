# URIContainsResourceType

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The URI for the CURD methods do not contain a resource type.

## Description

Per ARM RPC,Uri for resource CRUD methods MUST contain a resource type.
Uri path starts with \<scope\>/providers/\<namespace\>/\<resourcetype\> format, where

- \<scope\> is one of:
  1.  Tenant/Global: '/'
  2.  Subscription: "/subscriptions/{subscriptionId}"
  3.  Resource group: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
- \<namespace\> is a literal (e.g. "Microsoft.Compute") consisting of alphanumeric characters, plus '.'.

- \<resourcetype\> is a literal resource type name, follow below rules:
  1.  MUST consist of alphanumeric characters only
  2.  SHOULD describe the resource type
  3.  Must be lowerCamelCase words
  4.  Must be a plural

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Fix the URI for resource action as below pattern:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType..."
```
