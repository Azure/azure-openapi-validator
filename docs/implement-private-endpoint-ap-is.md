# ImplementPrivateEndpointAPIs

## Category

SDK Warning

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

The private endpoint API: {apiPath} is missing.

## Description

This rule is to check if all the APIs for private endpoint are implemented. Per design spec, for supporting private endpoint, the service should implement the following APIs:

PUT/DELETE/GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{groupName}/providers/Microsoft.[Service]/{resourceType}/{resourceName}/privateEndpointConnections/{privateEndpointConnectionName}?api-version=[version]

GET https://management.azure.com/subscriptions/{subId}/resourceGroups/{rgName}/providers/Microsoft.[Service]/[resources]/{resourceName}/privateEndpointConnections?api-version=[version]

GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{groupName}/providers/Microsoft.[Service]/[resources]/[resourceName]/privateLinkResources?api-version=[version]

## CreatedAt

February 23, 2021

## LastModifiedAt

February 23, 2021

## Why this rule is important

To meet the private endpoint design.

## How to fix the violation

Please add the missing private endpoint API path and operation to the swagger.
