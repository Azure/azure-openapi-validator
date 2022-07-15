# docLinkLocale

## Category

SDK Error

## Applies to

ARM & Data Plane OpenAPI(swagger) specs

## Output Message

The documentation link in the description contains locale info, please change it to the link without locale.

## Description

This rule is to ensure the documentation link in the description does not contains any locale.

## Why the rule is important

It's not friendly to the users which use different locale.

## How to fix the violation

for below description 
``` json
"description": "Please refer to https://docs.microsoft.com/en-us/azure/service-health/resource-health-overview for more details.",
```
you can change it to 
``` json
"description": "Please refer to https://docs.microsoft.com/azure/service-health/resource-health-overview for more details.",

```
