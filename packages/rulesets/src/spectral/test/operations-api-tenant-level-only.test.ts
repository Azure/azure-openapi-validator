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
      // correct
      "/providers/Microsoft.LoadTestService/operations": {
        get: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
      // incorrect
      "/subscriptions/{subscriptionId}/providers/Microsoft.LoadTestService/operations": {
        get: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
      "/providers/Microsoft.LoadTestService/subscriptions/{subscriptionId}/operations": {
        get: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.LoadTestService/operations": {
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
    expect(results.length).toBe(3)
    expect(results[0].message).toBe("The operations API must only be at the tenant level.")
    expect(results[0].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/Microsoft.LoadTestService/operations.get")
    expect(results[1].message).toBe("The operations API must only be at the tenant level.")
    expect(results[1].path.join(".")).toBe("paths./providers/Microsoft.LoadTestService/subscriptions/{subscriptionId}/operations.get")
    expect(results[2].message).toBe("The operations API must only be at the tenant level.")
    expect(results[2].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.LoadTestService/operations.get"
    )
  })
})

test("OperationsApiTenantLevelOnly should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.LoadTestService/operations": {
        get: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
      "/subscriptions/{subscriptionId}/providers/Microsoft.LoadTestService/loadTests": {
        get: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.LoadTestService/loadTests": {
        get: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.LoadTestService/loadTests/{loadTestName}": {
        get: {
          parameters: {},
          responses: {
            "200": {},
          },
        },
      },
      "/providers/Microsoft.Communication/locations/{location}/operationStatuses/{operationId}": {
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
    console.log(results)
    expect(results.length).toBe(0)
  })
})
