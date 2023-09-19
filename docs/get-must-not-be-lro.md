# GetMustNotBeLRO

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-14

## Output Message

The Get call cannot be Long Running Operation and it must not have `x-ms-long-running-operation-options` property block.

## Description

Only asynchronous(i.e. Long Running Operation) can have `x-ms-long-running-operation-options` property.
The Get calls are synchronous and it MUST NOT have
    - `x-ms-long-running-operation-options` property block
    - `x-ms-long-running-operation-options` set to `true`

## How to fix the violation

Ensure that the get operation `x-ms-long-running-operation` property set to `false` and MUST NOT contain `x-ms-long-running-operation-options` property block.

Please remove the following invalid block:

```json
...
 "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}": {
    "get": {
      ...
      ...
      "responses": {
        "200": {
            ...
            }
          }
      // Remove this block
      "x-ms-long-running-operation": true,
      "x-ms-long-running-operation-options": {
        "final-state-via": "azure-async-operation",
      },
    }
 }
...
...

The following is Valid

```json
...
 "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{Name}": {
    "get": {
      ...
      ...
      "responses": {
        "200": {
            ...
            }
          }
      "x-ms-long-running-operation": false,
    }
 }
...
...
