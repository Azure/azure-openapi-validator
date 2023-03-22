import linterForRule from "./utils"

let nonResolvingLinter: any

beforeAll(async () => {
  nonResolvingLinter = await linterForRule("OperationsApiSchemaUsesCommonTypes", true)
})

test("OperationsApiSchemaUsesCommonTypes should find errors when using redefined common type", () => {
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
        properties: {},
        description: "Describes the properties of a Compute Operation value.",
      },
      ComputeOperationValueDisplay: {
        properties: {},
        description: "Describes the properties of a Compute Operation Value Display.",
      },
    },
  }
  return nonResolvingLinter.run(oasDoc).then((results: any) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.MyNs/operations.get.responses.200.schema.$ref")
    expect(results[0].message).toContain("Operations API path must follow the schema provided in the common types.")
  })
})

test("OperationsApiSchemaUsesCommonTypes should find errors when using redefined common type in another file", () => {
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
              schema: { $ref: "#/../not-common-types/path.json#/definitions/OperationListResult" },
            },
          },
        },
      },
    },
  }
  return nonResolvingLinter.run(oasDoc).then((results: any) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.MyNs/operations.get.responses.200.schema.$ref")
    expect(results[0].message).toContain("Operations API path must follow the schema provided in the common types.")
  })
})

test("OperationsApiSchemaUsesCommonTypes should find no errors", () => {
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
              schema: { $ref: "../../../../../common-types/resource-management/v4/types.json#/definitions/OperationListResult" },
            },
          },
        },
      },
    },
  }
  return nonResolvingLinter.run(oasDoc).then((results: any) => {
    expect(results.length).toBe(0)
  })
})
