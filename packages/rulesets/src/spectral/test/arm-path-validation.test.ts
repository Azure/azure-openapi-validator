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

test("PathContainsResourceType should find errors for invalid path for third party RPs", () => {
  // invalid paths:
  //  1 <scope>/providers/PureStorage.Krypton/{vmName}
  //  2 <scope>/providers/{resourceName}/PureStorage.Krypton...
  //  3 <scope>/providers/ResourceType/PureStorage.Krypton...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/providers/PureStorage.Krypton/{resourceName}/resourceType": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/providers/{resourceName}/PureStorage.Krypton/resourceType": {
        get: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/providers/resourceType/PureStorage.Krypton/resourceType": {
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
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/providers/PureStorage.Krypton/{resourceName}/resourceType"
    )
    expect(results[1].message).toContain("The path for the CURD methods do not contain a resource type.")
    expect(results[1].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/providers/{resourceName}/PureStorage.Krypton/resourceType"
    )
    expect(results[2].message).toContain("The path for the CURD methods do not contain a resource type.")
    expect(results[2].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/resourceType/PureStorage.Krypton/resourceType")
  })
})

test("PathContainsResourceType should find no errors for valid path", () => {
  // valid paths:
  //  1 <scope>/providers/Microsoft.Compute/virtualMachines/{vmName}
  //  2 <scope>/providers/Microsoft.Compute/virtualMachines
  //  3 /providers/Microsoft.Compute/virtualMachines
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/providers/Microsoft.MyNs/resourceType/{resourceName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/providers/Microsoft.MyNs/resourceType": {
        get: {
          tags: ["SampleTag"],
          operationId: "Foo_Get",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/providers/Microsoft.MyNs/resourceType": {
        get: {
          tags: ["SampleTag"],
          operationId: "Foo_Get",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
    },
  }
  return linters.PathContainsResourceType.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PathContainsResourceType should find no errors for valid paths for third party RPs", () => {
  // valid paths:
  //  1 <scope>/providers/PureStorage.Krypton/virtualMachines/{vmName}
  //  2 <scope>/providers/PureStorage.Krypton/virtualMachines
  //  3 /providers/PureStorage.Krypton/virtualMachines
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/providers/PureStorage.Krypton/resourceType/{resourceName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/providers/PureStorage.Krypton/resourceType": {
        get: {
          tags: ["SampleTag"],
          operationId: "Foo_Get",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/providers/PureStorage.Krypton/resourceType": {
        get: {
          tags: ["SampleTag"],
          operationId: "Foo_Get",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
    },
  }
  return linters.PathContainsResourceType.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
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

test("PathContainsResourceGroup should find errors for invalid path for third party RPs", () => {
  // invalid paths:
  //  1 <scope>/providers/PureStorage.Krypton/{vmName}
  //  2 <scope>/providers/{resourceName}/PureStorage.Krypton...
  //  3 <scope>/providers/ResourceType/PureStorage.Krypton...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/providers/PureStorage.Krypton/{resourceName}/resourceType": {
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
      "paths./subscriptions/{subscriptionId}/resourceGroups/providers/PureStorage.Krypton/{resourceName}/resourceType"
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

test("PathContainsSubscription should find errors for invalid path for thirs party RPs", () => {
  // invalid paths:
  //  1 <scope>/providers/PureStorage.Krypton/{vmName}
  //  2 <scope>/providers/{resourceName}/PureStorage.Krypton...
  //  3 <scope>/providers/ResourceType/PureStorage.Krypton...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/resourceGroups/providers/PureStorage.Krypton/{resourceName}/resourceType": {
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
    expect(results[0].path.join(".")).toBe("paths./subscriptions/resourceGroups/providers/PureStorage.Krypton/{resourceName}/resourceType")
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

test("PathForPutOperation should find errors for invalid path for thirs party RPs", () => {
  // invalid paths:
  //  1 <scope>/providers/PureStorage.Krypton/{vmName}
  //  2 <scope>/providers/{resourceName}/PureStorage.Krypton...
  //  3 <scope>/providers/ResourceType/PureStorage.Krypton...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/{scope}/providers/PureStorage.Krypton/virtualMachine/{vmName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/providers/PureStorage.Krypton/resourceType/{resourceName}": {
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
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/providers/PureStorage.Krypton/resourceType/{resourceName}"
    )
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
      "/{scope}/providers/Microsoft.AVS/privateClouds/{privateCloudName}/autoscalehistory/limit/{limit}": {
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
    expect(results.length).toBe(3)
    expect(results[0].message).toContain("The path for nested resource doest not meet the valid resource pattern.")
    expect(results[0].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/diskList")
    expect(results[1].path.join(".")).toBe(
      "paths./{scope}/providers/Microsoft.Compute/virtualMachine/{vmName}/disk/{diskName}/DiskSize/list"
    )
    expect(results[2].path.join(".")).toBe(
      "paths./{scope}/providers/Microsoft.AVS/privateClouds/{privateCloudName}/autoscalehistory/limit/{limit}"
    )
  })
})

test("PathForNestedResource should find errors for invalid path for third party RPs", () => {
  // invalid paths:
  //  1 <scope>/providers/PureStorage.Krypton/{vmName}
  //  2 <scope>/providers/{resourceName}/PureStorage.Krypton...
  //  3 <scope>/providers/ResourceType/PureStorage.Krypton...
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/{scope}/providers/PureStorage.Krypton/virtualMachine/{vmName}/disk/diskList": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/{scope}/providers/PureStorage.Krypton/virtualMachine/{vmName}/disk/{diskName}/DiskSize/list": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/{scope}/providers/PureStorage.Krypton/virtualMachine/{vmName}/disk/default": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/{scope}/providers/PureStorage.Krypton/privateClouds/{privateCloudName}/autoscalehistory/limit/{limit}": {
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
    expect(results.length).toBe(3)
    expect(results[0].message).toContain("The path for nested resource doest not meet the valid resource pattern.")
    expect(results[0].path.join(".")).toBe("paths./{scope}/providers/PureStorage.Krypton/virtualMachine/{vmName}/disk/diskList")
    expect(results[1].path.join(".")).toBe(
      "paths./{scope}/providers/PureStorage.Krypton/virtualMachine/{vmName}/disk/{diskName}/DiskSize/list"
    )
    expect(results[2].path.join(".")).toBe(
      "paths./{scope}/providers/PureStorage.Krypton/privateClouds/{privateCloudName}/autoscalehistory/limit/{limit}"
    )
  })
})

test("PathForNestedResource should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/contentTemplates/{templateId}":
        {
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
    expect(results.length).toBe(0)
  })
})

test("PathForNestedResource should find no errors for third party RPs", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/PureStorage.Krypton/workspaces/{workspaceName}/providers/PureStorage.Krypton/contentTemplates/{templateId}":
        {
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
    expect(results.length).toBe(0)
  })
})

test("PathForResourceAction should find errors for invalid path and no errors for valid path", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/addSong": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
    },
  }
  return linters.PathForResourceAction.run(oasDoc).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music"
    )
    expect(results[0].message).toContain("Path for 'post' method on a resource type MUST follow valid resource naming.")
    expect(results[1].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}"
    )
    expect(results[1].message).toContain("Path for 'post' method on a resource type MUST follow valid resource naming.")
  })
})

test("PathForResourceAction should find errors for invalid path and no errors for valid path for third party RPs", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/PureStorage.Krypton": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/PureStorage.Krypton/Songs/{songName}": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/PureStorage.Krypton/Songs/{songName}/addSong": {
        post: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
    },
  }
  return linters.PathForResourceAction.run(oasDoc).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/PureStorage.Krypton"
    )
    expect(results[0].message).toContain("Path for 'post' method on a resource type MUST follow valid resource naming.")
    expect(results[1].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/PureStorage.Krypton/Songs/{songName}"
    )
    expect(results[1].message).toContain("Path for 'post' method on a resource type MUST follow valid resource naming.")
  })
})
