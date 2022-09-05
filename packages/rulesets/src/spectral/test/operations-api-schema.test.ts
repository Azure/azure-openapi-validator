import linterForRule from "./utils"

let linter: any

beforeAll(async () => {
  linter = await linterForRule("OperationsApiResponseSchema")
})

test("OperationsApiResponseSchema should find errors for invalid path", () => {
  // invalid paths:
  //  1 <scope>/providers/Microsoft.Compute/{vmName}
  //  2 <scope>/providers/{resourceName}/Microsoft.MyNs...
  //  3 <scope>/providers/ResourceType/Microsoft.MyNs...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.MyNs/operations": {
        get: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {
            "200": {
              schema: { $ref: "#/definitions/ComputeOperationListResult" },
            },
          },
        },
      },
    },
    definitions: {
      ComputeOperationListResult: {
        properties: {
          value: {
            type: "array",
            readOnly: true,
            items: {
              $ref: "#/definitions/ComputeOperationValue",
            },
            description: "The list of compute operations",
          },
        },
        description: "The List Compute Operation operation response.",
      },
      ComputeOperationValue: {
        properties: {
          origin: {
            type: "string",
            readOnly: true,
            description: "The origin of the compute operation.",
          },
          name: {
            type: "string",
            readOnly: true,
            description: "The name of the compute operation.",
          },
          display: {
            "x-ms-client-flatten": true,
            $ref: "#/definitions/ComputeOperationValueDisplay",
          },
        },
        description: "Describes the properties of a Compute Operation value.",
      },
      ComputeOperationValueDisplay: {
        properties: {
          operation: {
            type: "string",
            readOnly: true,
            description: "The display name of the compute operation.",
          },
          resource: {
            type: "string",
            readOnly: true,
            description: "The display name of the resource the operation applies to.",
          },
          description: {
            type: "string",
            readOnly: true,
            description: "The description of the operation.",
          },
          provider: {
            type: "string",
            readOnly: true,
            description: "The resource provider for the operation.",
          },
        },
        description: "Describes the properties of a Compute Operation Value Display.",
      },
    },
  }
  return linter.run(oasDoc).then((results: any) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.MyNs/operations.get.responses.200.schema")
    expect(results[0].message).toContain(
      "The response schema of operations API '/providers/Microsoft.MyNs/operations' does not match the ARM specification. Please standardize the schema."
    )
  })
})
