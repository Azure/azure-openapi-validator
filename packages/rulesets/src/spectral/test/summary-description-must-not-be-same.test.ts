import linterForRule from "./utils"

let linter: any

beforeAll(async () => {
  linter = await linterForRule("SummaryAndDescriptionMustNotBeSame")
})

test("SummaryAndDescriptionMustNotBeSame should find errors", () => {
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
          summary: "Test Description",
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
            type: "string",
            readOnly: true,
          },
        },
        description: "The List Compute Operation operation response.",
      },
    },
  }
  return linter.run(oasDoc).then((results: any) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.MyNs/operations.get")
    expect(results[0].message).toContain("The summary and description values should not be same.")
  })
})

test("SummaryAndDescriptionMustNotBeSame should find no errors", () => {
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
          summary: "Test Summary",
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
            type: "string",
            readOnly: true,
          },
        },
        description: "The List Compute Operation operation response.",
      },
    },
  }
  return linter.run(oasDoc).then((results: any) => {
    expect(results.length).toBe(0)
  })
})
