# ResponseSchemaSpecifiedForSuccessStatusCode

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-24

## Output Message

The ${code} success status code has missing response schema. 200 and 201 success status codes for an ARM PUT operation must have a response schema specified.

## Description

Validates if 200 & 201 success status codes for an ARM PUT operation has a response schema specified.

## How to fix 

Ensure that, for 200 & 201 success status codes in a PUT has response schema specified.

## Bad examples

```json
      "/foo": {
        put: {
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "Success",
            },
            "201": {
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
```

## Good examples

```json
      "/foo": {
        put: {
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
            "201": {
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
```
