import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linters: { [index: string]: Spectral } = {}

beforeAll(async () => {
  linters.URIContainsResourceType = await linterForRule("URIContainsResourceType")
  linters.URIContainsResourceGroup = await linterForRule("URIContainsResourceGroup")
  linters.URIContainsSubscriptionId = await linterForRule("URIContainsSubscriptionId")
  linters.URIForPutOperation = await linterForRule("URIForPutOperation")
  linters.URIForNestedResource = await linterForRule("URIForNestedResource")
  linters.URIForResourceAction = await linterForRule("URIForResourceAction")
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
        get: {
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
  return linters.URIContainsResourceType.run(oasDoc).then((results) => {
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
  return linters.URIContainsResourceGroup.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain("The URI for resource group scoped CRUD methods does not contain a resourceGroupName parameter.")

    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/providers/Microsoft.MyNs/{resourceName}/resourceType"
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
  return linters.URIContainsSubscriptionId.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain("The URI for the subscriptions scoped CRUD methods do not contain the subscriptionId parameter.")

    expect(results[0].path.join(".")).toBe("paths./subscriptions/resourceGroups/providers/Microsoft.MyNs/{resourceName}/resourceType")
  })
})

test("URIForPutOperation should find errors for invalid path", () => {
  // invalid paths:
  //  1 <scope>/providers/Microsoft.Compute/{vmName}
  //  2 <scope>/providers/{resourceName}/Microsoft.MyNs...
  //  3 <scope>/providers/ResourceType/Microsoft.MyNs...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}": {
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
      "/subscriptions/{subscriptionId}/providers/Microsoft.MyNs/resourceType/{resourceName}": {
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
  return linters.URIForPutOperation.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain("The URI for 'put' operation must be under a subscription and resource group.")
    expect(results[0].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/Microsoft.MyNs/resourceType/{resourceName}")
  })
})

test("URIForNestedResource should find errors for invalid path", () => {
  // invalid paths:
  //  1 <scope>/providers/Microsoft.Compute/{vmName}
  //  2 <scope>/providers/{resourceName}/Microsoft.MyNs...
  //  3 <scope>/providers/ResourceType/Microsoft.MyNs...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/diskList": {
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
      "/{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/{diskName}/DiskSize/list": {
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
      "/{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/default": {
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
  return linters.URIForNestedResource.run(oasDoc).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].message).toContain("The URI for nested resource doest not meet the valid resource pattern.")
    expect(results[0].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/diskList")
    expect(results[1].path.join(".")).toBe(
      "paths./{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/{diskName}/DiskSize/list"
    )
  })
})
