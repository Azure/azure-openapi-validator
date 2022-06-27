import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("RepeatedUriInfo")
  return linter
})

test("RepeatedUriInfo should find errors", () => {
  // Test parameter names in 3 different places:
  // 1. parameter at path level
  // 2. inline parameter at operation level
  // 3. referenced parameter at operation level
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/providers/Microsoft.MyNs/foo/{fooName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [
            {
              $ref: "#/parameters/SubscriptionIdParameter",
            },
            {
              name: "fooName",
              in: "path",
              required: true,
              type: "string",
            },
            {
              name: "FooResource",
              in: "body",
              required: true,
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          ],
          responses: {},
        },
      },
    },
    parameters: {
      SubscriptionIdParameter: {
        name: "subscriptionId",
        in: "path",
        required: true,
        type: "string",
        description: "The ID of the target subscription.",
      },
    },
    definitions: {
      FooResource: {
        properties: {
          properties: {
            type: "object",
            properties: {
              // repeated 'fooName' property.
              fooName: {
                type: "string",
                description: "The name of the foo resource",
              },
            },
          },
        },
        "x-ms-azure-resource": true,
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/Microsoft.MyNs/foo/{fooName}.put.parameters.1")
  })
})
