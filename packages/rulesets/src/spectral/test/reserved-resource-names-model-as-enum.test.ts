import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("ReservedResourceNamesModelAsEnum")
  return linter
})

test("ReservedResourceNamesAsEnum should find errors on path level", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foos/fooName": {
        get: {
          parameters: [],
          responses: {},
        },
        put: {
          responses: {},
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foos/fooName"
    )
    expect(results[0].message).toBe(
      'The service-defined (reserved name) resource "fooName" should be represented as a path parameter enum with `modelAsString` set to `true`.'
    )
  })
})

test("ReservedResourceNamesAsEnum should find no errors when path variable is used", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/{fooName}": {
        parameters: [],
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

test("ReservedResourceNamesAsEnum should find no errors for post", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foos/fooName": {
        parameters: [],
        post: {
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

test("ReservedResourceNamesAsEnum should find no errors when second-to-last path part does not end with an 's'", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/My.NS/foo/fooName": {
        parameters: [],
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

test("ReservedResourceNamesAsEnum should find no errors for 'operations' endpoint", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/My.NS/foo/operations": {
        parameters: [],
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
