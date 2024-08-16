import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

const ERROR_MESSAGE = "The schema for body parameters must specify type:object and include a definition for its reference model."

beforeAll(async () => {
  linter = await linterForRule("ParametersSchemaAsTypeObject")
  return linter
})

test("ParametersSchemaAsTypeObject should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/default": {
        get: {
          parameters: [
            {
              $ref: "#/parameters/LoadTestNameParameter",
            },
            {
              $ref: "#/parameters/QuotaBucketNameParameter",
            },
          ],
        },
      },
    },
    parameters: {
      LoadTestNameParameter: {
        in: "body",
        name: "loadTestName",
        description: "Load Test name.",
        required: true,
        "x-ms-parameter-location": "method",
        schema: {
          type: "object",
        },
      },
      QuotaBucketNameParameter: {
        in: "body",
        name: "quotaBucketName",
        description: "Quota Bucket name.",
        required: true,
        "x-ms-parameter-location": "method",
        schema: {
          type: "string",
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe(
      "paths./providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/default.get.parameters.1.schema.type",
    )
    expect(results[0].message).toContain(ERROR_MESSAGE)
  })
})

test("ParametersSchemaAsTypeObject should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    "/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/default": {
      get: {
        parameters: [
          {
            $ref: "#/parameters/LoadTestNameParameter",
          },
          {
            $ref: "#/parameters/ResourceGroupName",
          },
          {
            $ref: "#/parameters/QuotaBucketNameParameter",
          },
        ],
      },
    },
    definitions: {
      ResourceGroup: {
        description: "The ResourceGroup model definition.",
        properties: {
          id: {
            readOnly: true,
            type: "string",
            description: "ResourceGroup Id",
          },
        },
      },
    },
    parameters: {
      LoadTestNameParameter: {
        in: "body",
        name: "loadTestName",
        description: "Load Test name.",
        required: true,
        "x-ms-parameter-location": "method",
        schema: {
          $ref: "#/definitions/ResourceGroup",
        },
      },
      QuotaBucketNameParameter: {
        in: "body",
        name: "quotaBucketName",
        description: "Quota Bucket name.",
        required: true,
        "x-ms-parameter-location": "method",
        type: "string",
      },
      ResourceGroupName: {
        name: "resourceGroupName",
        in: "body",
        required: true,
        schema: {
          // define schema with type:object
          type: "object",
          Resource: {
            description: "The resource",
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The name of the Resource",
              },
            },
          },
        },
        description: "The name of the resource group.",
        "x-ms-parameter-location": "method",
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
