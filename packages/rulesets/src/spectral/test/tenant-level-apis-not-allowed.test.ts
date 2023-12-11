import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

const ERROR_MESSAGE =
  "is a tenant level api. Tenant level APIs are strongly discouraged and subscription or resource group level APIs are preferred instead. If you cannot model your APIs at these levels, you will need to present your design and get an exception from PAS team."

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("TenantLevelAPIsNotAllowed")
  return linter
})

test("TenantLevelAPIsNotAllowed should find no errors for non tenant level api paths and operations api-path", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/operations": {
        put: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
      "/subscriptions/{subscriptionId}/providers/Microsoft.Music/songs/{songName}": {
        put: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft..Music/songs/{songName}": {
        get: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("TenantLevelAPIsNotAllowed should find no errors for extension resources", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/{resourceUri}/providers/Microsoft.Music/songs": {
        put: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
      "/subscriptions/{subscription1}/resourceGroups/{resourceGroup1}/providers/Microsoft.Foo/resourceType/{resourceType1}/providers/Microsoft.Music/songs":
        {
          put: {
            parameters: {},
            responses: {
              "200": {},
            },
          },
        },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("TenantLevelAPIsNotAllowed should find no errors for non put teant-level api paths", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs": {
        post: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("TenantLevelAPIsNotAllowed should find errors for tenant level api path for put operation", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs": {
        put: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs")
    expect(results[0].message).toContain(ERROR_MESSAGE)
  })
})
