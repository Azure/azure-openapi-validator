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
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines": {
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
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines/{virtualMachineInstance}/nestedvirtualMachines": {
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
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines/{virtualMachineInstance}/nestedvirtualMachines/{nestedVirtualMachineInstance}/deeplyNestedvirtualMachines":
        {
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
      "/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines": {
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
      "{scope}/providers/Microsoft.Music/Configurations": {
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
    expect(results.length).toBe(5)
    expect(results[0].path.join(".")).toBe("paths./{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines.get")
    expect(results[0].message).toBe(errorMessage)
    expect(results[1].path.join(".")).toBe(
      "paths./{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines/{virtualMachineInstance}/nestedvirtualMachines.get",
    )
    expect(results[1].message).toBe(errorMessage)
    expect(results[2].path.join(".")).toBe(
      "paths./{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines/{virtualMachineInstance}/nestedvirtualMachines/{nestedVirtualMachineInstance}/deeplyNestedvirtualMachines.get",
    )
    expect(results[2].message).toBe(errorMessage)
    expect(results[3].path.join(".")).toBe("paths./providers/Microsoft.ConnectedVMwarevSphere/virtualMachines.get")
    expect(results[3].message).toBe(errorMessage)
    expect(results[4].path.join(".")).toBe("paths.{scope}/providers/Microsoft.Music/Configurations.get")
    expect(results[4].message).toBe(errorMessage)
  })
})

test("CollectionObjectPropertiesNaming should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines/default": {
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
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines": {
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
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines/{virtualMachineInstance}/nestedvirtualMachines": {
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
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines/{default}": {
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
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines/{virtualMachineInstance}": {
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
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines/{virtualMachineInstance}/nestedvirtualMachines/{nestedvirtualMachineInstance}":
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
      "{scope}/providers/Microsoft.Music/Configurations": {
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
      "{scope}/providers/Microsoft.Music/Configurations/{configName}": {
        get: {
          operationId: "test_ListByID",
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
      "{scope}/providers/Microsoft.Music/Configurations/config/providers/Microsoft.Song/nestedConfigurations/nestedConfig": {
        get: {
          operationId: "test_ListByID",
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
      "{scope}/providers/Microsoft.Music/Configurations/config/providers/Microsoft.Song/nestedConfigurations/nestedConfig/Microsoft.Voice/deeplyNestedConfigurations/deeplyNestedConfig":
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
      "/providers/Microsoft.ConnectedVMwarevSphere/virtualMachiness": {
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
      "/{resourceUri}/providers/Microsoft.ConnectedVMwarevSphere/virtualMachines/virtualMachinesInstances/nestedvirtualMachines/nestedvirtualMachinesInstances":
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
