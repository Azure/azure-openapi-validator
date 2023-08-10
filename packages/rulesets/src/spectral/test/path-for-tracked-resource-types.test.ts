import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("PathForTrackedResourceTypes")
  return linter
})

test("PathForTrackedResourceTypes should find errors for tracked resources having invalid path", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}": {
        get: {
          tags: ["SampleTag"],
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
              schema: {
                $ref: "#/definitions/FooResourceUpdate",
              },
            },
          },
        },
        put: {
          tags: ["SampleTag"],
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
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/providers/Microsoft.Compute/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}":
        {
          get: {
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
                schema: {
                  $ref: "#/definitions/FooResourceUpdate",
                },
              },
            },
          },
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
                schema: {
                  $ref: "#/definitions/FooResource",
                },
              },
            },
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}/nestedResourceType/actions":
        {
          get: {
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
                schema: {
                  $ref: "#/definitions/FooResourceUpdate",
                },
              },
            },
          },
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
                schema: {
                  $ref: "#/definitions/FooResource",
                },
              },
            },
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/providers/virtualMachine/{vmName}/{nestedResourceType}": {
        get: {
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
              schema: {
                $ref: "#/definitions/FooResourceUpdate",
              },
            },
          },
        },
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
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/nestedResourceType/{nestedResourceType}":
        {
          get: {
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
                schema: {
                  $ref: "#/definitions/FooResourceUpdate",
                },
              },
            },
          },
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
                schema: {
                  $ref: "#/definitions/FooResource",
                },
              },
            },
          },
        },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          location: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(5)
    expect(results[0].path.join(".")).toContain("put")
    expect(results[0].message).toContain("The path must be under a subscription and resource group for tracked resource types.")
    expect(results[1].path.join(".")).toContain("put")
    expect(results[1].message).toContain("The path must be under a subscription and resource group for tracked resource types.")
    expect(results[2].path.join(".")).toContain(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}/nestedResourceType/actions"
    )
    expect(results[2].message).toContain("The path must be under a subscription and resource group for tracked resource types.")
    expect(results[3].path.join(".")).toContain(
      "paths./subscriptions/{subscriptionId}/resourceGroups/providers/virtualMachine/{vmName}/{nestedResourceType}"
    )
    expect(results[3].message).toContain("The path must be under a subscription and resource group for tracked resource types.")
    expect(results[4].path.join(".")).toContain("put")
    expect(results[4].message).toContain("The path must be under a subscription and resource group for tracked resource types.")
  })
})

test("PathForTrackedResourceTypes should not find errors for tracked resources", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}": {
        get: {
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
              schema: {
                $ref: "#/definitions/FooResourceUpdate",
              },
            },
          },
        },
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
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}":
        {
          get: {
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
                schema: {
                  $ref: "#/definitions/FooResourceUpdate",
                },
              },
            },
          },
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
                schema: {
                  $ref: "#/definitions/FooResource",
                },
              },
            },
          },
        },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          location: {
            type: "string",
          },
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
test("PathForTrackedResourceTypes should not find errors for other resources", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}": {
        get: {
          tags: ["SampleTag"],
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
              schema: {
                $ref: "#/definitions/FooResourceUpdate",
              },
            },
          },
        },
        put: {
          tags: ["SampleTag"],
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
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/providers/Microsoft.Compute/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}":
        {
          get: {
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
                schema: {
                  $ref: "#/definitions/FooResourceUpdate",
                },
              },
            },
          },
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
                schema: {
                  $ref: "#/definitions/FooResource",
                },
              },
            },
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}":
        {
          get: {
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
                schema: {
                  $ref: "#/definitions/FooResourceUpdate",
                },
              },
            },
          },
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
                schema: {
                  $ref: "#/definitions/FooResource",
                },
              },
            },
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}":
        {
          get: {
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
                schema: {
                  $ref: "#/definitions/FooResourceUpdate",
                },
              },
            },
          },
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
                schema: {
                  $ref: "#/definitions/FooResource",
                },
              },
            },
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}":
        {
          get: {
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
                schema: {
                  $ref: "#/definitions/FooResourceUpdate",
                },
              },
            },
          },
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
                schema: {
                  $ref: "#/definitions/FooResource",
                },
              },
            },
          },
        },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooResourceUpdate: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
