import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

const errorMessage = "A nested resource type's List operation must include all the parent segments in its api path."

beforeAll(async () => {
  linter = await linterForRule("MissingSegmentsInNestedResourceListOperation")
  return linter
})

test("MissingSegmentsInNestedResourceListOperation should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ConnectedCache/enterpriseMccCustomers/{customerName}/enterpriseMccCacheNodes":
        {
          get: {
            description: "Nested Resource Type with resourceGroups and other Parent Resource Type",
            responses: {},
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ConnectedCache/NoParentResourceType/{customerName}":
        {
          get: {
            description: "Parent Resource Type",
            responses: {},
          },
        },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ConnectedCache/enterpriseMccCustomers/{customerName}/enterpriseMccCacheNodes"
    )
    expect(results[0].message).toBe(errorMessage)
  })
})

test("MissingSegmentsInNestedResourceListOperation should find errors if Nested exists and no Parent Resource Type", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ConnectedCache/enterpriseMccCustomers/{customerName}/enterpriseMccCacheNodes":
        {
          get: {
            description: "Nested Resource Type with resourceGroups and no Parent Resource Type",
          },
        },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ConnectedCache/enterpriseMccCustomers/{customerName}/enterpriseMccCacheNodes"
    )
    expect(results[0].message).toBe(errorMessage)
  })
})

test("MissingSegmentsInNestedResourceListOperation should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ConnectedCache/enterpriseMccCustomers/{customerName}/enterpriseMccCacheNodes":
        {
          get: {
            description: "Nested Resource Type with resourceGroups and Parent Resource Type",
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ConnectedCache/enterpriseMccCustomers/{customerName}":
        {
          get: {
            description: "Parent Resource Type",
          },
        },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
