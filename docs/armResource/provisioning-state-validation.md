# ProvisioningStateValidation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

ProvisioningState must have terminal states: Succeeded, Failed and Canceled.

## Description

Per ARM guideline, provisioningState must have terminal states: Succeeded, Failed and Canceled.

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Ensure the provisioningState has states: 'Succeeded, Failed and Canceled', like

```json
   provisioningState: {
            type: "string",
            enum: ["Canceled", "Succeeded", "Failed"],
          },
```
