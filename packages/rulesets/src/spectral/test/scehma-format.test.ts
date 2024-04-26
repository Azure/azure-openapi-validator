import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("ValidFormats")
  return linter
})

test("schema-format should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/test1": {
        post: {
          parameters: [
            {
              name: "version",
              in: "body",
              schema: {
                type: "object",
                properties: {
                  prop1: {
                    type: "integer",
                    format: "int52",
                  },
                  prop2: {
                    type: "object",
                    properties: {
                      prop3: {
                        type: "string",
                        format: "special",
                      },
                    },
                  },
                  prop3: {
                    type: "boolean",
                    format: "yes-or-no",
                  },
                  prop4: {
                    type: "number",
                  },
                },
                allOf: [
                  {
                    properties: {
                      prop5: {
                        type: "string",
                        format: "email",
                      },
                    },
                  },
                ],
              },
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
          propX: {
            type: "object",
            properties: {
              propY: {
                type: "string",
                format: "secret",
              },
            },
          },
          propZ: {
            type: "integer",
          },
          propZZ: {
            $ref: "#/definitions/PropZZ",
          },
        },
        allOf: [
          {
            $ref: "#/definitions/ModelA",
          },
        ],
      },
      PropZZ: {
        type: "string",
        format: "ZZTop",
      },
      ModelA: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "guid",
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(7)
    expect(results[0].path.join(".")).toBe("paths./test1.post.parameters.0.schema.properties.prop1.format")
    expect(results[0].message).toBe("'int52' is not a known format.")
    expect(results[1].path.join(".")).toBe("paths./test1.post.parameters.0.schema.properties.prop2.properties.prop3.format")
    expect(results[1].message).toBe("'special' is not a known format.")
    expect(results[2].path.join(".")).toBe("paths./test1.post.parameters.0.schema.properties.prop3.format")
    expect(results[2].message).toBe("'yes-or-no' is not a known format.")
    expect(results[3].path.join(".")).toBe("definitions.Model1.properties.propW.format")
    expect(results[3].message).toBe("'exponential' is not a known format.")
    expect(results[4].path.join(".")).toBe("definitions.Model1.properties.propX.properties.propY.format")
    expect(results[4].message).toBe("'secret' is not a known format.")
    expect(results[5].path.join(".")).toBe("definitions.PropZZ.format")
    expect(results[5].message).toBe("'ZZTop' is not a known format.")
    expect(results[6].path.join(".")).toBe("definitions.ModelA.properties.id.format")
    expect(results[6].message).toBe("'guid' is not a known format.")
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
              name: "version",
              in: "body",
              schema: {
                type: "object",
                properties: {
                  prop1: {
                    type: "integer",
                    format: "int64",
                  },
                  prop2: {
                    type: "object",
                    properties: {
                      prop3: {
                        type: "string",
                        format: "byte",
                      },
                    },
                  },
                  prop3: {
                    type: "boolean",
                  },
                  prop4: {
                    type: "number",
                    format: "float",
                  },
                },
                allOf: [
                  {
                    properties: {
                      prop5: {
                        type: "string",
                      },
                    },
                  },
                ],
              },
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
          format: {
            type: "string",
            description: "Property happens to be named 'format' but should be ignored by rule"
          },
          type: {
            type: "string",
            description: "Property happens to be named 'type', but it's value (object) should indicate 'format' should be ignored"
          },
          propW: {
            type: "number",
            format: "double",
          },
          propX: {
            type: "object",
            properties: {
              propY: {
                type: "string",
                format: "duration",
              },
            },
          },
          propZ: {
            type: "integer",
            format: "int32",
          },
          propZZ: {
            $ref: "#/definitions/PropZZ",
          },
          allOf: [
            {
              $ref: "#/definitions/ModelA",
            },
          ],
        },
      },
      PropZZ: {
        type: "string",
        format: "url",
      },
      ModelA: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
