# AvoidNestedProperties

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Description

Consider using x-ms-client-flatten to provide a better end user experience. Nested properties can result into bad user experience especially when creating request objects. `x-ms-client-flatten` flattens the model properties so that the users can analyze and set the properties much more easily. Overly nested properties (especially required ones) can result into a non optimal user experience.

## How to fix

Use the `x-ms-client-flatten` property for a better user experience. More details about the extension can be found [here](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-client-flatten).

## Bad examples

## Bad example 1
Deeply nested properties exist and the x-ms-client-flatten extension is not specified

```json
    definitions: {
      externalDocs: {
        type: "object",
        properties: {
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Resource tags.",
          },
          properties: {
            type: "object",
            properties: {
              timeOfDayUTC: {
                type: "string",
                pattern: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
                description: "The time of day (in UTC) to start the maintenance window.",
              },
            },
          },
        },
      },
    },
```

## Bad example 2
Deeply nested properties exist and the x-ms-client-flatten extension is specified in the schema object and not against the complex type

```json
    definitions: {
      externalDocs: {
        type: "object",
        properties: {
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Resource tags.",
          },
          properties: {
            type: "object",
            // x-ms-client-flatten should have been specified here
            properties: {
              "x-ms-client-flatten": true,
              timeOfDayUTC: {
                type: "string",
                pattern: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
                description: "The time of day (in UTC) to start the maintenance window.",
              },
            },
          },
        },
      },
    },
```
## Good examples

## Good example 1 

Deeply nested properties exist and the x-ms-client-flatten extension is specified against the complex type

```json
    definitions: {
      externalDocs: {
        type: "object",
        properties: {
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Resource tags.",
          },
          properties: {
            type: "object",
            "x-ms-client-flatten": true,
            properties: {
              timeOfDayUTC: {
                type: "string",
                pattern: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
                description: "The time of day (in UTC) to start the maintenance window.",
              },
            },
          },
        },
      },
    },
```