import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("NoDuplicatePathsForScopeParameter")
  return linter
})

test("NoDuplicatePathsForScopeParameter should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/SubscriptionIdParameter" }, { $ref: "#/parameters/ResourceGroupParameter" }],
        },
      },
      "/subscriptions/{subscriptionId}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/SubscriptionIdParameter" }],
        },
      },
      "/{scope}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/ScopeParameter" }],
        },
      },
    },
    parameters: {
      SubscriptionIdParameter: {
        name: "subscriptionId",
        in: "path",
        required: true,
      },
      ResourceGroupParameter: {
        name: "resourceGroupName",
        in: "path",
        required: true,
      },
      ScopeParameter: {
        name: "scope",
        in: "path",
        required: true,
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
    expect(results[1].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
  })
})

test("NoDuplicatePathsForScopeParameter should find no errors with scope parameter", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/{scope}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/ScopeParameter" }],
        },
      },
    },
    parameters: {
      ScopeParameter: {
        name: "scope",
        in: "path",
        required: true,
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("NoDuplicatePathsForScopeParameter should find no errors with explicitly defined scopes", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/SubscriptionIdParameter" }, { $ref: "#/parameters/ResourceGroupParameter" }],
        },
      },
      "/subscriptions/{subscriptionId}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/SubscriptionIdParameter" }],
        },
      },
    },
    parameters: {
      SubscriptionIdParameter: {
        name: "subscriptionId",
        in: "path",
        required: true,
      },
      ResourceGroupParameter: {
        name: "resourceGroupName",
        in: "path",
        required: true,
      },
      ScopeParameter: {
        name: "scope",
        in: "path",
        required: true,
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
