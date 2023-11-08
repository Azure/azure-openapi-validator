# PathForNestedResource

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-06

## Output Message

The path for nested resource doest not meet the valid resource pattern.

## Description

Path for CRUD methods on a nested resource type MUST follow valid resource naming, like '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}/NestedResourceType/{nestedResourceName}'.

There is one exception where extension resources with fully qualified path of the below format can exist
"/providers/Microsoft.Compute/virtualMachines/{virtualMachineName}/{resourceProviderScope}/providers/Microsoft.Quota/groupQuotas/{groupQuotaName}/groupQuotaRequests/{requestId}"
In such cases the author would need to suppress the error being flagged using https://github.com/Azure/autorest/blob/main/docs/generate/suppress-warnings.md#suppress-warnings

## CreatedAt

June 21, 2022

## LastModifiedAt

June 21, 2022

## How to fix the violation

Fix the path for nested resource as below pattern:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{ResourceName}/NestedResourceType/{nestedResourceName}"
```
