# RequiredReadOnlySystemData

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

1. if missing the systemData , output:
   The response of operation '{operationId}' is defined without 'systemData'. Consider adding the systemData to the response.

2. if the systemData is not read only, output:
   The property systemData in the response of operation:'${operationId}' is not read only. Please add the readonly for the systemData.

## Description

Per [common-api-contracts](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/common-api-contracts.md#system-metadata-for-all-azure-resources), all Azure resources should implement the `systemData` object property in new api-version. The systemData should be readonly.

## CreatedAt

May 21, 2020

## LastModifiedAt

February 26, 2021

## How to fix the violation

For each response in the GET/PUT/PATCH operation add a readonly systemData property.
It's recommended to refer to the 'systemData' defined in [v2/types.json](https://github.com/Azure/azure-rest-api-specs/blob/7dddc4bf1e402b6e6737c132ecf05b74e2b53b08/specification/common-types/resource-management/v2/types.json#L445) which is provided for fixing the error.

```json
"MyResource": {
  "properties": {
    ...
    ...
    "systemData": {
      "$ref": "v2/types.json#/definitions/systemData",
       "readOnly" : true
    }
  }
}

```
