import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("OperationsApiTenantLevelOnly")
  return linter
})

test("OperationsApiTenantLevelOnly should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.LoadTestService/operations": {},
      "/subscriptions/{subscriptionId}/providers/Microsoft.LoadTestService/operations": {},
      "/providers/Microsoft.LoadTestService/subscriptions/{subscriptionId}/operations": {},
      "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.LoadTestService/operations": {},
      "/subscriptions/{subscriptionId}/providers/Microsoft.LoadTestService/loadTests": {},
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.LoadTestService/loadTests": {},
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.LoadTestService/loadTests/{loadTestName}": {},
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].message).toBe("The operations API must only be at the tenant level.")
    expect(results[0].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/Microsoft.LoadTestService/operations")
    expect(results[1].message).toBe("The operations API must only be at the tenant level.")
    expect(results[1].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.LoadTestService/operations"
    )
  })
})

test("OperationsApiTenantLevelOnly should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.LoadTestService/operations": {},
      "/providers/Microsoft.LoadTestService/subscriptions/{subscriptionId}/operations": {},
      "/subscriptions/{subscriptionId}/providers/Microsoft.LoadTestService/loadTests": {},
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.LoadTestService/loadTests": {},
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.LoadTestService/loadTests/{loadTestName}": {},
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
