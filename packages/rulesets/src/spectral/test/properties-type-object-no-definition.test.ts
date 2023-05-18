import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"
let linter: Spectral
const errorMessageObject =
  "Properties with type:object that dont reference a model definition are not allowed. ARM doesnt allow generic type definitions as this leads to bad customer experience."
const errorMessageNull = "Properties with type NULL is not allowed."

beforeAll(async () => {
  linter = await linterForRule("PropertiesTypeObjectNoDefinition")
  return linter
})

test("PropertiesTypeObjectNoDefinition similar to swagger should find errors", () => {
  const oasDoc1 = {
    swagger: "2.0",
    definitions: {
      type: "object",
      source: {
        type: "object",
        properties: {
          type: "object",
          info: {
            type: "",
          },
        },
      },
      info: {
        type: "object",
        properties: {
          type: "object",
          info: {
            type: "object",
            params: {
              type: "object",
            },
          },
        },
      },
      tags: {
        type: "object",
        params: {
          type: "object",
        },
      },
      resource: {
        type: "object",
      },
    },
  }
  return linter.run(oasDoc1).then((results) => {
    expect(results.length).toBe(4)
    expect(results[0].path.join(".")).toBe("definitions.source.properties.info")
    expect(results[1].path.join(".")).toBe("definitions.info.properties.info.params")
    expect(results[2].path.join(".")).toBe("definitions.tags.params")
    expect(results[3].path.join(".")).toBe("definitions.resource")
    expect(results[0].message).toBe(errorMessageNull)
    expect(results[1].message).toBe(errorMessageObject)
    expect(results[2].message).toBe(errorMessageObject)
    expect(results[3].message).toBe(errorMessageObject)
  })
})

test("PropertiesTypeObjectNoDefinition should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    definitions: {
      type: "object",
      source: {
        type: "object",
        properties: {
          type: "object",
          info: {
            type: "string",
          },
        },
      },
      info: {
        type: "object",
        properties: {
          type: "object",
          info: {
            type: "object",
            params: {
              type: "boolean",
            },
          },
        },
      },
      tags: {
        type: "object",
        params: {
          type: "int",
        },
      },
      resource: {
        type: "object",
        params: {
          type: "string",
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
