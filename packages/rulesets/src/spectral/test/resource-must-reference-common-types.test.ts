import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let nonResolvingLinter: Spectral
const RULE = "ResourceMustReferenceCommonTypes"

beforeAll(async () => {
  nonResolvingLinter = linterForRule(RULE, true)
  return nonResolvingLinter
})

test(`${RULE} should find errors`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Bakery/breads/{breadName}": {
        get: {
          responses: {
            200: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
          },
        },
        put: {
          responses: {
            200: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
          },
        },
      },
    },
    definitions: {
      Bread: {
        type: "object",
        properties: {
          name: {
            description: "bread name",
            type: "string",
          },
        },
      },
    },
  }

  return nonResolvingLinter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toBe(
      "Resource definition 'Bread' must reference the common types resource definition for ProxyResource or TrackedResource."
    )
  })
})

test(`${RULE} should find no errors`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Bakery/breads/{breadName}": {
        get: {
          responses: {
            200: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
          },
        },
        put: {
          responses: {
            200: {
              description: "a response",
              schema: {
                $ref: "#/definitions/Bread",
              },
            },
          },
        },
      },
    },
    "/providers/Microsoft.Bakery/cookies/{cookieName}": {
      get: {
        responses: {
          200: {
            description: "a response",
            schema: {
              $ref: "#/definitions/Cookie",
            },
          },
        },
      },
      put: {
        responses: {
          200: {
            description: "a response",
            schema: {
              $ref: "#/definitions/Cookie",
            },
          },
        },
      },
    },
    definitions: {
      Bread: {
        type: "object",
        properties: {
          name: {
            description: "bread name",
            type: "string",
          },
          allOf: [
            {
              $ref: "../../../../../common-types/resource-management/v1/types.json#/definitions/ProxyResource",
            },
          ],
        },
      },
    },
    Cookie: {
      type: "object",
      properties: {
        name: {
          description: "cookie name",
          type: "string",
        },
        allOf: [
          {
            $ref: "../../../../../common-types/resource-management/v1/types.json#/definitions/TrackedResource",
          },
        ],
      },
    },
  }

  return nonResolvingLinter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
