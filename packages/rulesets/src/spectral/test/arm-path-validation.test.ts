import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

const linters: { [index: string]: Spectral } = {}

beforeAll(async () => {
  linters.PathContainsResourceType = await linterForRule("PathContainsResourceType")
  linters.PathContainsResourceGroup = await linterForRule("PathContainsResourceGroup")
  linters.PathContainsSubscriptionId = await linterForRule("PathContainsSubscriptionId")
  linters.PathForPutOperation = await linterForRule("PathForPutOperation")
  linters.PathForNestedResource = await linterForRule("PathForNestedResource")
  linters.PathForResourceAction = await linterForRule("PathForResourceAction")
})

test("PathContainsResourceType should find errors for invalid path", () => {
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
        },
      },
      "/subscriptions/{subscriptionId}/providers/{resourceName}/Microsoft.MyNs/resourceType": {
        get: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/providers/resourceType/Microsoft.MyNs/resourceType": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
    },
  }
  return linters.PathContainsResourceType.run(oasDoc).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].message).toContain("The path for the CURD methods do not contain a resource type.")

    expect(results[0].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/Microsoft.MyNs/{resourceName}/resourceType")
    expect(results[1].message).toContain("The path for the CURD methods do not contain a resource type.")
    expect(results[1].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/{resourceName}/Microsoft.MyNs/resourceType")
    expect(results[2].message).toContain("The path for the CURD methods do not contain a resource type.")
    expect(results[2].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/resourceType/Microsoft.MyNs/resourceType")
  })
})

test("PathContainsResourceGroup should find errors for invalid path", () => {
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
        },
      },
    },
  }
  return linters.PathContainsResourceGroup.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain("The path for resource group scoped CRUD methods does not contain a resourceGroupName parameter.")

    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/providers/Microsoft.MyNs/{resourceName}/resourceType"
    )
  })
})
test("PathContainsSubscription should find errors for invalid path", () => {
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
        },
      },
    },
  }
  return linters.PathContainsSubscriptionId.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain("The path for the subscriptions scoped CRUD methods do not contain the subscriptionId parameter.")

    expect(results[0].path.join(".")).toBe("paths./subscriptions/resourceGroups/providers/Microsoft.MyNs/{resourceName}/resourceType")
  })
})

test("PathForPutOperation should find errors for invalid path", () => {
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
        },
      },
      "/subscriptions/{subscriptionId}/providers/Microsoft.MyNs/resourceType/{resourceName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
    },
  }
  return linters.PathForPutOperation.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toContain("The path for 'put' operation must be under a subscription and resource group.")
    expect(results[0].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/Microsoft.MyNs/resourceType/{resourceName}")
  })
})

test("PathForNestedResource should find errors for invalid path", () => {
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
        },
      },
      "/{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/{diskName}/DiskSize/list": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/default": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
    },
  }
  return linters.PathForNestedResource.run(oasDoc).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].message).toContain("The path for nested resource doest not meet the valid resource pattern.")
    expect(results[0].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/diskList")
    expect(results[1].path.join(".")).toBe(
      "paths./{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/{diskName}/DiskSize/list"
    )
  })
})
