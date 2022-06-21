import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linters: Spectral[] = []

beforeAll(async () => {
  linters.push(await linterForRule("URIContainsResourceType"))
  linters.push(await linterForRule("URIContainsResourceGroup"))
  linters.push(await linterForRule("URIContainsSubscriptionId"))
})

test("URIContainsResourceType should find errors for invalid path", () => {
  // invalid paths:
  //  1 <scope>/providers/Microsoft.Compute/{vmName}
  //  2 <scope>/providers/{resourceName}/Microsoft.MyNs...
  //  3 <scope>/providers/ResourceType/Microsoft.MyNs...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/providers/Microsoft.MyNs/{resourceName}/resourceType": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "original-uri",
          },
        },
      },
      "/subscriptions/{subscriptionId}/providers/{resourceName}/Microsoft.MyNs/resourceType": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "original-uri",
          },
        },
      },
      "/subscriptions/{subscriptionId}/providers/resourceType/Microsoft.MyNs/resourceType": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "original-uri",
          },
        },
      },
    },
  }
  return linters[0].run(oasDoc).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].message).toContain("The URI for the CURD methods do not contain a resource type.")

    expect(results[0].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/Microsoft.MyNs/{resourceName}/resourceType")
    expect(results[1].message).toContain("The URI for the CURD methods do not contain a resource type.")
    expect(results[1].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/{resourceName}/Microsoft.MyNs/resourceType")
    expect(results[2].message).toContain("The URI for the CURD methods do not contain a resource type.")
    expect(results[2].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/resourceType/Microsoft.MyNs/resourceType")
  })
})

test("URIContainsResourceGroup should find errors for invalid path", () => {
  // invalid paths:
  //  1 <scope>/providers/Microsoft.Compute/{vmName}
  //  2 <scope>/providers/{resourceName}/Microsoft.MyNs...
  //  3 <scope>/providers/ResourceType/Microsoft.MyNs...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/providers/Microsoft.MyNs/{resourceName}/resourceType": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "original-uri",
          },
        },
      },
    },
  }
  return linters[1].run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain("The URI for resource group scoped CRUD methods does not contain a resourceGroupName parameter.")

    expect(results[0].path.join(".")).toBe(
      "/subscriptions/{subscriptionId}/resourceGroups/providers/Microsoft.MyNs/{resourceName}/resourceType"
    )
  })
})
test("URIContainsSubscription should find errors for invalid path", () => {
  // invalid paths:
  //  1 <scope>/providers/Microsoft.Compute/{vmName}
  //  2 <scope>/providers/{resourceName}/Microsoft.MyNs...
  //  3 <scope>/providers/ResourceType/Microsoft.MyNs...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/resourceGroups/providers/Microsoft.MyNs/{resourceName}/resourceType": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
          "x-ms-long-running-operation": true,
          "x-ms-long-running-operation-options": {
            "final-state-via": "original-uri",
          },
        },
      },
    },
  }
  return linters[2].run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain("The URI for the subscriptions scoped CRUD methods do not contain the subscriptionId parameter.")

    expect(results[0].path.join(".")).toBe("/subscriptions/resourceGroups/providers/Microsoft.MyNs/{resourceName}/resourceType")
  })
})
