# XmsPageableForListCalls

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Get-V1-13

## Output Message

`x-ms-pageable` extension must be specified for LIST APIs.

## Description

`x-ms-pageable` indicates that the results of a GET call may be paginated. All LIST APIs (a.k.a collection GETs) should include this annotation. Specifying this extension does not mean that the service must implement paging at runtime. The service may implement this when such a requirement arises. Specifying the extension upfront future proofs the API and avoids the breaking changes that may be flagged if the extension were to be introduced in future.

## How to fix the violation

Please include `x-ms-pageable` extension to the collection GET calls.

### Valid Example

```json5
...
// Parent list call with `x-ms-pageable`
"/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine": {
  "get": {
    "operationId": "test_ListByID",
    "responses": {
      "200": {
        "description": "Success",
        "schema": {
          "properties": {
            "value": {
              "type": "array"
            },
            "nextLink": {
              "type": "string"
            }
          },
          "required": [
            "value"
          ]
        }
      }
    },
    // include this block
    "x-ms-pageable": {
      "nextLinkName": "nextLink",
    },
  }
},
// Nested list call with `x-ms-pageable`
"/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/{virtualMachineInstances}/nestedVirtualMachine": {
  "get": {
    "operationId": "test_ListByID",
    "responses": {
      "200": {
        "description": "Success",
        "schema": {
          "properties": {
            "value": {
              "type": "array"
            },
            "nextLink": {
              "type": "string"
            }
          },
          "required": [
            "value"
          ]
        }
      }
    },
    // include this
    "x-ms-pageable": {
      "nextLinkName": null,
    },
  }
}
...
```

### Invalid Example

```json5
...
// Parent list call with no `x-ms-pageable`
"/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine": {
  "get": {
    "operationId": "test_ListByID",
    "responses": {
      "200": {
        "description": "Success",
        "schema": {
          "properties": {
            "value": {
              "type": "array"
            },
            "nextLink": {
              "type": "string"
            }
          },
          "required": [
            "value"
          ]
        }
      }
    }
  }
},
// Nested list call with `x-ms-pageable`
"/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/{virtualMachineInstances}/nestedVirtualMachine": {
  "get": {
    "operationId": "test_ListByID",
    "responses": {
      "200": {
        "description": "Success",
        "schema": {
          "properties": {
            "value": {
              "type": "array"
            },
            "nextLink": {
              "type": "string"
            }
          },
          "required": [
            "value"
          ]
        }
      }
    }
  }
}
...
```