import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

const errorMessage = "`x-ms-pageable` extension must be specified for LIST APIs."

beforeAll(async () => {
  linter = await linterForRule("XmsPageableForListCalls")
  return linter
})

test("XmsPageableForListCalls should find errors if x-ms-pagebale property is not defined.", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine": {
        get: {
          operationId: "test_ListByID",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                  nextLink: {
                    type: "string",
                  },
                },
                required: ["value"],
              },
            },
          },
        },
      },
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/{virtualMachineInstances}/nestedVirtualMachine": {
        get: {
          operationId: "test_ListByID",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                  nextLink: {
                    type: "string",
                  },
                },
                required: ["value"],
              },
            },
          },
        },
      },
      "/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine": {
        get: {
          operationId: "Good_List",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                  nextLink: {
                    type: "string",
                  },
                },
                required: ["value"],
              },
            },
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Configurations": {
        get: {
          operationId: "test_ListByID",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                  nextLink: {
                    type: "string",
                  },
                },
                required: ["value"],
              },
            },
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4)
    expect(results[0].path.join(".")).toBe("paths./{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine.get")
    expect(results[0].message).toBe(errorMessage)
    expect(results[1].path.join(".")).toBe(
      "paths./{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/{virtualMachineInstances}/nestedVirtualMachine.get",
    )
    expect(results[1].message).toBe(errorMessage)
    expect(results[2].path.join(".")).toBe("paths./providers/Microsoft.ConnectedVMwarevSphere/virtualMachine.get")
    expect(results[2].message).toBe(errorMessage)
    expect(results[3].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Configurations.get",
    )
    expect(results[3].message).toBe(errorMessage)
  })
})

test("CollectionObjectPropertiesNaming should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/default": {
        get: {
          operationId: "Good_List",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                  nextLink: {
                    type: "string",
                  },
                },
                required: ["value"],
              },
            },
          },
        },
      },
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine": {
        get: {
          operationId: "Good_List",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                  nextLink: {
                    type: "string",
                  },
                },
                required: ["value"],
              },
            },
          },
          "x-ms-pageable": {
            nextLinkName: "nextLink",
          },
        },
      },
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/{virtualMachineInstances}/nestedvirtualMachine": {
        get: {
          operationId: "Good_List2",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                  nextLink: {
                    type: "string",
                  },
                },
                required: ["value"],
              },
            },
          },
          "x-ms-pageable": {
            nextLinkName: null,
          },
        },
      },
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/{default}": {
        get: {
          operationId: "Good_List3",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                  nextPage: {
                    type: "string",
                  },
                },
                required: ["value"],
              },
            },
          },
        },
      },
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/{virtualMachineInstance}": {
        get: {
          operationId: "Good_NotList",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                },
                required: ["value"],
              },
            },
          },
        },
      },
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/{virtualMachineInstances}/nestedvirtualMachine/{nestedvirtualMachineInstances}":
        {
          get: {
            operationId: "Good_List2",
            responses: {
              200: {
                description: "Success",
                schema: {
                  properties: {
                    value: {
                      type: "array",
                    },
                    nextLink: {
                      type: "string",
                    },
                  },
                  required: ["value"],
                },
              },
            },
            "x-ms-pageable": {
              nextLinkName: null,
            },
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Configurations": {
        get: {
          operationId: "test_ListByID",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                  nextLink: {
                    type: "string",
                  },
                },
                required: ["value"],
              },
            },
          },
          "x-ms-pageable": {
            nextLinkName: null,
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Configurations/config": {
        get: {
          operationId: "test_ListByID",
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Configurations/config/providers/Microsoft.Song/nestedConfigurations/nestedConfig":
        {
          get: {
            operationId: "test_ListByID",
            responses: {
              200: {
                description: "Success",
              },
            },
          },
        },
      "/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine": {
        get: {
          operationId: "Good_List",
          responses: {
            200: {
              description: "Success",
              schema: {
                properties: {
                  value: {
                    type: "array",
                  },
                  nextLink: {
                    type: "string",
                  },
                },
                required: ["value"],
              },
            },
          },
          "x-ms-pageable": {
            nextLinkName: null,
          },
        },
      },
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachine/virtualMachineInstances/nestedvirtualMachine/nestedvirtualMachineInstances":
        {
          get: {
            operationId: "Good_List2",
            responses: {
              200: {
                description: "Success",
              },
            },
          },
        },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
