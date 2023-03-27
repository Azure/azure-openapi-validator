import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let nonResolvingLinter: Spectral
const ERROR_MESSAGE = "Must use the schema provided in the common types for SystemData."

beforeAll(async () => {
  nonResolvingLinter = await linterForRule("SystemDataDefinitionsCommonTypes", true)
  return nonResolvingLinter
})

test("SystemDataDefinitionsCommonTypes should find errors", async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          systemData: {
            $ref: "../not/common/types",
          },
          SystemData: {
            $ref: "../not/common/types",
          },
        },
      },
    },
  }
  return nonResolvingLinter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("definitions.Resource.properties.systemData.$ref")
    expect(results[0].message).toBe(ERROR_MESSAGE)
    expect(results[1].path.join(".")).toBe("definitions.Resource.properties.SystemData.$ref")
    expect(results[1].message).toBe(ERROR_MESSAGE)
  })
})

test("SystemDataDefinitionsCommonTypes should find no errors", async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          systemData: {
            $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/systemData",
          },
          SystemData: {
            $ref: "../../../../../common-types/resource-management/v13/types.json#/definitions/systemData",
          },
        },
      },
    },
  }
  return nonResolvingLinter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
