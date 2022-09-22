import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("ResourceNameRestriction")
  return linter
})

test("ResourceNameRestriction should find errors on path level", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}": {
        parameters: [
          {
            name: "fooName",
            in: "path",
            required: true,
            type: "string",
            "x-ms-parameter-location": "method",
          },
        ],
        get: {
          parameters: [],
          responses: {},
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}"
    )
    expect(results[0].message).toContain("The resource name parameter should be defined with a 'pattern' restriction.")
  })
})

test("ResourceNameRestriction should find errors on operation level", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}": {
        get: {
          parameters: [
            {
              name: "fooName",
              in: "path",
              required: true,
              type: "string",
              "x-ms-parameter-location": "method",
            },
          ],
          responses: {},
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}"
    )
    expect(results[0].message).toContain("The resource name parameter should be defined with a 'pattern' restriction.")
  })
})

test("ResourceNameRestriction should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}": {
        parameters: [
          {
            name: "fooName",
            in: "path",
            required: true,
            type: "string",
            pattern: "[a-zA-Z_0-9]+",
            "x-ms-parameter-location": "method",
          },
        ],
        get: {
          parameters: [],
          responses: {},
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
