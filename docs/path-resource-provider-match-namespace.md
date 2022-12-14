# PathResourceProviderMatchNamespace

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Uri-V1-03

## Output Message

The resource provider namespace name '{0}' in the path doesn't match the namespace name to which the specification file belongs.

## Description

Verifies whether the resource provider namespace in the last segment of the path matches the namespace to which the specification file belongs. E.g the path /providers/Microsoft.Compute/virtualMachines/{vmName}/providers/Microsoft.Insights/extResource/{extType}' is allowed only if the segment /Microsoft.Insights matches the namespace name to which the specification file belongs (Microsoft.Insights).

## Why the rule is important

Per the [ARM guidelines](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md), each OpenAPI(swagger) specification must contain one resource provider. So the last resource provider must match with the resource provider namespace.

## How to fix the violation

One OpenAPI(swagger) specification must locate in proper namespace. Namespace is parent folder. E.g. Microsoft.Insights. Please make sure the last resource provider name matches the namespace name.
[Literate Configuration](https://github.com/Azure/autorest/blob/185e337137c990b9cc1b8ebbb272e76eeeef43a1/docs/user/literate-file-formats/configuration.md).

## Impact on generated code

N/A.

## Examples

## Bad Examples**: Following example contains 2 resource providers. **Microsoft.Compute** and **Microsoft.Network

Following example contains 2 resource providers. **Microsoft.Compute** and **Microsoft.Network**.

```json
"paths": {
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{virtualMachineScaleSetName}/virtualMachines/{virtualmachineIndex}/networkInterfaces": {
      "get": {
        "tags": [
          "NetworkInterfaces"
        ],
        "operationId": "NetworkInterfaces_ListVirtualMachineScaleSetVMNetworkInterfaces",
        "description": "Gets information about all network interfaces in a virtual machine in a virtual machine scale set.",
        "parameters": [
          {
            "name": "resourceGroupName",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "The name of the resource group."
          },
      ....
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/applicationGateways": {
      "get": {
        "tags": [
          "ApplicationGateways"
        ],
        "operationId": "ApplicationGateways_List",
        "description": "Lists all application gateways in a resource group.",
        "parameters": [
          {
            "name": "resourceGroupName",
            "in": "path",
            "required": true,
            "type": "string",
            "description": "The name of the resource group."
          },
      ....
```
