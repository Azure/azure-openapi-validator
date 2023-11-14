import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("PatchPropertiesCorrespondToPutProperties")
  return linter
})
const ERROR_MESSAGE =
  "A patch request body must only contain properties present in the corresponding put request body, and must contain at least one of the properties."

test("PatchPropertiesCorrespondToPutProperties should find errors if the patch body parameters are not in the put body", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
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
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
            "201": {
              description: "newly created",
              schema: {
                $ref: "#/definitions/FooRequestParams",
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
      BarRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/BarProps",
          },
        ],
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
      BarProps: {
        properties: {
          id: {
            type: "string",
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        properties: {
          provisioningState: {
            type: "string",
            description: "Provisioning state of the foo rule.",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((res) => {
    expect(res.length).toBe(2)
    expect(res[0].message).toContain(ERROR_MESSAGE)
    expect(res[0].path.join(".")).toBe("paths./foo.patch.parameters")
    expect(res[1].message).toContain(ERROR_MESSAGE)
    expect(res[1].path.join(".")).toBe("paths./foo.patch.parameters")
  })
})

test("PatchPropertiesCorrespondToPutProperties should find errors if patch body is not defined", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "path",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
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
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
            "201": {
              description: "newly created",
              schema: {
                $ref: "#/definitions/FooRequestParams",
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
        "x-ms-azure-resource": true,
        properties: {
          provisioningState: {
            type: "string",
            description: "Provisioning state of the foo rule.",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain("Patch operations body cannot be empty.")
    expect(results[0].path.join(".")).toBe("paths./foo.patch.parameters")
  })
})

test("PatchPropertiesCorrespondToPutProperties should find errors if patch has properties and put body is not defined", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        patch: {
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
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
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
              name: "foo_put",
              in: "path",
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
            "201": {
              description: "newly created",
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
        "x-ms-azure-resource": true,
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain("Non empty patch body with an empty put body is not valid")
    expect(results[0].path.join(".")).toBe("paths./foo.patch.parameters")
  })
})

test("PatchPropertiesCorrespondToPutProperties should find errors when patch has additional property in deeply nested structure", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/BarRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
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
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
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
      BarRequestParams: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
          testBarParams: {
            $ref: "#/definitions/BarProps",
          },
        },
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
      BarProps: {
        properties: {
          testBarProps: {
            $ref: "#/definitions/FooTest",
          },
        },
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooTest",
          },
        ],
        "x-ms-azure-resource": true,
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
        },
      },
      FooTest: {
        properties: {
          provisioningState: {
            type: "string",
            description: "Provisioning state of the foo rule.",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain(ERROR_MESSAGE)
    expect(results[0].path.join(".")).toBe("paths./foo.patch.parameters")
  })
})

test("PatchPropertiesCorrespondToPutProperties should find errors when patch has additional property in deeply nested structure including allOf", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/BarRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
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
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
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
      BarRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooRequestParams",
          },
        ],
        properties: {
          id: {
            type: "string",
          },
          testBarParams: {
            $ref: "#/definitions/BarProps",
          },
        },
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
      BarProps: {
        properties: {
          testBarProps: {
            $ref: "#/definitions/FooTest",
          },
        },
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooTest",
          },
        ],
        "x-ms-azure-resource": true,
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
        },
      },
      FooTest: {
        properties: {
          provisioningState: {
            type: "string",
            description: "Provisioning state of the foo rule.",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain(ERROR_MESSAGE)
    expect(results[0].path.join(".")).toBe("paths./foo.patch.parameters")
  })
})

test("PatchPropertiesCorrespondToPutProperties should find errors when patch has property with different values", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/BarRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
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
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
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
      BarRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/BarProps",
          },
        ],
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
      BarProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            description: "identity",
          },
        },
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooTest",
          },
        ],
        "x-ms-azure-resource": true,
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
        },
      },
      FooTest: {
        properties: {
          provisioningState: {
            type: "string",
            description: "Provisioning state of the foo rule.",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain(ERROR_MESSAGE)
    expect(results[0].path.join(".")).toBe("paths./foo.patch.parameters")
  })
})

test("PatchPropertiesCorrespondToPutProperties should not find errors when patch has put property at a different level", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/BarRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
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
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
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
      BarRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/BarProps",
          },
        ],
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
      BarProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
      FooResource: {
        allOf: [
          {
            $ref: "#/definitions/FooTest",
          },
        ],
        "x-ms-azure-resource": true,
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
        },
      },
      FooTest: {
        properties: {
          provisioningState: {
            type: "string",
            description: "Provisioning state of the foo rule.",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PatchPropertiesCorrespondToPutProperties should find no errors when patch has only put properties", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/BarRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooResource",
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
              name: "foo_put",
              in: "body",
              schema: {
                $ref: "#/definitions/FooProps",
              },
            },
            {
              name: "foo1_put",
              in: "path",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "success",
              schema: {
                $ref: "#/definitions/FooProps",
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
      BarRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/BarProps",
          },
        ],
      },
      FooProps: {
        properties: {
          servicePrecedence: {
            description:
              "A precedence value that is used to decide between services when identifying the QoS values to use for a particular SIM. A lower value means a higher priority. This value should be unique among all services configured in the mobile network.",
            type: "integer",
            format: "int32",
            minimum: 0,
            maximum: 255,
          },
          id: {
            type: "string",
          },
        },
      },
      BarProps: {
        properties: {
          id: {
            type: "string",
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        properties: {
          provisioningState: {
            type: "string",
            description: "Provisioning state of the foo rule.",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PatchPropertiesCorrespondToPutProperties should not find error when patch doesnt exist", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkWatchers/{networkWatcherName}":
        {
          put: {
            tags: ["NetworkWatchers"],
            operationId: "NetworkWatchers_CreateOrUpdate",
            description: "Creates or updates a network watcher in the specified resource group.",
            parameters: [
              {
                name: "parameters",
                in: "body",
                required: true,
                schema: {
                  $ref: "#/definitions/PacketCapture",
                },
                description: "Parameters that define the network watcher resource.",
              },
            ],
            responses: {
              "200": {
                description: "Update successful. The operation returns the resulting network watcher resource.",
                schema: {
                  $ref: "#/definitions/PacketCapture",
                },
              },
              "201": {
                description: "Create successful. The operation returns the resulting network watcher resource.",
                schema: {
                  $ref: "#/definitions/PacketCapture",
                },
              },
              default: {
                description: "Error response describing why the operation failed.",
                schema: {
                  $ref: "#/definitions/ErrorResponse",
                },
              },
            },
          },
          patch: {
            tags: ["NetworkWatchers"],
            operationId: "NetworkWatchers_UpdateTags",
            description: "Updates a network watcher tags.",
            parameters: [
              {
                name: "parameters",
                in: "body",
                required: true,
                schema: {
                  $ref: "#/definitions/PacketCapture",
                },
                description: "Parameters supplied to update network watcher tags.",
              },
            ],
            responses: {
              "200": {
                description: "Update successful. The operation returns the resulting network watcher resource.",
                schema: {
                  $ref: "#/definitions/PacketCapture",
                },
              },
              default: {
                description: "Error response describing why the operation failed.",
                schema: {
                  $ref: "#/definitions/ErrorResponse",
                },
              },
            },
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkWatchers/{networkWatcherName}/packetCaptures/{packetCaptureName}":
        {
          put: {
            tags: ["PacketCaptures"],
            operationId: "PacketCaptures_Create",
            description: "Create and start a packet capture on the specified VM.",
            parameters: [
              {
                name: "parameters",
                in: "body",
                required: true,
                schema: {
                  $ref: "#/definitions/PacketCapture",
                },
                description: "Parameters that define the create packet capture operation.",
              },
            ],
            responses: {
              "201": {
                description: "Request successful. The operation returns the resulting packet capture session.",
                schema: {
                  $ref: "#/definitions/PacketCapture",
                },
              },
              default: {
                description: "Error response describing why the operation failed.",
                schema: {
                  $ref: "#/definitions/ErrorResponse",
                },
              },
            },
            "x-ms-long-running-operation": true,
            "x-ms-long-running-operation-options": {
              "final-state-via": "azure-async-operation",
            },
          },
        },
    },
    definitions: {
      ErrorResponse: {
        description: "The error object.",
        properties: {
          error: {
            title: "Error",
            description: "The error details object.",
          },
        },
      },
      PacketCapture: {
        properties: {
          properties: {
            "x-ms-client-flatten": true,
            $ref: "#/definitions/PacketCaptureParameters",
            description: "Properties of the packet capture.",
          },
        },
        required: ["properties"],
        description: "Parameters that define the create packet capture operation.",
      },
      PacketCaptureParameters: {
        properties: {
          scope: {
            $ref: "#/definitions/PacketCaptureMachineScope",
            description: "A list of AzureVMSS instances",
          },
        },
        required: ["target", "storageLocation"],
        description: "Parameters that define the create packet capture operation.",
      },
      PacketCaptureMachineScope: {
        type: "object",
        properties: {
          include: {
            type: "array",
            description: "List of AzureVMSS instances to run packet capture on.",
            items: {
              type: "string",
            },
          },
        },
        description: "A list of AzureVMSS",
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
