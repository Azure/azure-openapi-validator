import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("SubscriptionsAndResourceGroupCasing")
  return linter
})

test("SubscriptionsAndResourceGroupCasing should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/Subscriptions/{subscriptionsId}": {},
      "/subscriptions/{subscriptionsId}/resourcegroups": {},
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./Subscriptions/{subscriptionsId}")
    expect(results[0].message).toContain("The path segment Subscriptions should be subscriptions.")
    expect(results[1].path.join(".")).toBe("paths./subscriptions/{subscriptionsId}/resourcegroups")
    expect(results[1].message).toContain("The path segment resourcegroups should be resourceGroups.")
  })
})

test("SubscriptionsAndResourceGroupCasing should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionsId}/resourceGroups/{resourcegroupName}": {},
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
