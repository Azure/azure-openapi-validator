import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("XmsParameterLocation")
  return linter
})

test("XmsParameterLocation should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/test1": {
        post: {
          parameters: [
            {
              $ref: "#/parameters/SubscriptionId",
            },
          ],
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/Model1",
              },
            },
          },
        },
      },
    },
    definitions: {
      Model1: {
        type: "object",
        properties: {
          propW: {
            type: "number",
            format: "exponential",
          },
        },
      },
    },
    parameters: {
      SubscriptionId: {
        name: "subscriptionId",
        schema: {
          type: "object",
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("parameters.SubscriptionId")
    expect(results[0].message).toBe(
      `The parameter 'SubscriptionId' is defined in global parameters section without 'x-ms-parameter-location' extension. This would add the parameter as the client property. Please ensure that this is exactly you want. If so, apply the extension "x-ms-parameter-location": "client". Else, apply the extension "x-ms-parameter-location": "method".`
    )
  })
})

test("schema-format should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/test1": {
        post: {
          parameters: [
            {
              $ref: "#/parameters/SubscriptionId",
            },
          ],
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/Model1",
              },
            },
          },
        },
      },
    },
    definitions: {
      Model1: {
        type: "object",
        properties: {
          propW: {
            type: "number",
            format: "exponential",
          },
        },
      },
    },
    parameters: {
      SubscriptionId: {
        name: "subscriptionId",
        schema: {
          type: "object",
        },
        "x-ms-parameter-location": "client",
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
