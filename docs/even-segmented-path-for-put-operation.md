# EvenSegmentedPathForPutOperation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-02

## Output Message

API path with PUT operation defined MUST have even number of segments (i.e. end in {resourceType}/{resourceName} segments).

## Description

API path with PUT operation defined MUST have even number of segments (i.e. end in {resourceType}/{resourceName} segments).

## How to fix the violation

Fix the path with PUT defined to,match one of the below patterns:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{ResourceName}
```

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{ResourceName}/NestedResourceType/{nestedResourceName}"
```
