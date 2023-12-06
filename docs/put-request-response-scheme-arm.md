# PutRequestResponseSchemeArm

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-25

## Description

A PUT operation request body schema should be the same as its 200 response schema, to allow reusing the response as a request to another PUT operation. This will provide a consistent experience to the user, i.e. the user could use the same model object to perform multiple operations. Also, within the SDK, this will encourage reuse of the same model objects.

## How to fix

Ensure the request & response('200') schema of the PUT operation must be same.

## Bad examples

```json
      "/api/configServers": {
        put: {
          operationId: "ConfigServers_Update",
          parameters: [
            {
              $ref: "#/parameters/ApiVersionParameter",
            },
            {
              $ref: "#/parameters/SubscriptionIdParameter",
            },
            {
              $ref: "#/parameters/PathResourceParameter",
            },
          ],
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/ConfigServerResource",
              },
            },
          },
        },
      },
    },
    parameters: {
      PathResourceParameter: {
        name: "pathResource",
        in: "body",
        description: "Parameters for the update operation",
        required: true,
        schema: {
          $ref: "#/definitions/ConfigServerResources", // Different from the response schema specified for 200 response
        },
      },
    },

```

## Good examples

```json
      "/api/configServers": {
        put: {
          operationId: "ConfigServers_Update",
          parameters: [
            {
              $ref: "#/parameters/ApiVersionParameter",
            },
            {
              $ref: "#/parameters/SubscriptionIdParameter",
            },
            {
              $ref: "#/parameters/PathResourceParameter",
            },
          ],
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/ConfigServerResource",
              },
            },
          },
        },
      },
    },
    parameters: {
      PathResourceParameter: {
        name: "pathResource",
        in: "body",
        description: "Parameters for the update operation",
        required: true,
        schema: {
          $ref: "#/definitions/ConfigServerResource", // Same as the response schema specified for 200 response
        },
      },
    },

```
