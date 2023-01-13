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
    // expect(results[0].path.join(".")).toBe("paths./test1/{p1}.parameters.1.name")
    // expect(results[1].path.join(".")).toBe("paths./test1/{p1}.get.parameters.0.name")
    // expect(results[2].path.join(".")).toBe("paths./test1/{p1}.get.parameters.1.name")
    // expect(results[3].path.join(".")).toBe("paths./test1/{p1}.get.parameters.3.name")
  })
})

// test("NoDuplicatePathsForScopeParameter should find no errors", () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {},
//     parameters: {},
//   }
//   return linter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(0)
//   })
// })
