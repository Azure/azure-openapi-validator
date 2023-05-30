import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let nonResolvingLinter: Spectral
const RULE = "SystemDataInPropertiesBag"
const ERROR_MESSAGE = "System Data must be defined as a top-level property, not in the properties bag."

beforeAll(async () => {
  nonResolvingLinter = await linterForRule(RULE, true)
  return nonResolvingLinter
})

// test(`${RULE} should find errors for system data in inline properties bag`, async () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {},
//     definitions: {
//       Resource: {
//         properties: {
//           properties: {
//             systemData: {
//               $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/systemData",
//             },
//             SystemData: {
//               $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/systemData",
//             },
//           },
//         },
//       },
//     },
//   }
//   return nonResolvingLinter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(2)
//     expect(results[0].path.join(".")).toBe("definitions.Resource.properties.properties.systemData")
//     expect(results[0].message).toBe(ERROR_MESSAGE)
//     expect(results[1].path.join(".")).toBe("definitions.Resource.properties.properties.SystemData")
//     expect(results[1].message).toBe(ERROR_MESSAGE)
//   })
// })

// test(`${RULE} should find errors for system data in inline nested properties bag`, async () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {},
//     definitions: {
//       Resource: {
//         properties: {
//           properties: {
//             properties: {
//               systemData: {
//                 $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/systemData",
//               },
//               SystemData: {
//                 $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/systemData",
//               },
//             },
//           },
//         },
//       },
//     },
//   }
//   return nonResolvingLinter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(2)
//     expect(results[0].path.join(".")).toBe("definitions.Resource.properties.properties.properties.systemData")
//     expect(results[0].message).toBe(ERROR_MESSAGE)
//     expect(results[1].path.join(".")).toBe("definitions.Resource.properties.properties.properties.SystemData")
//     expect(results[1].message).toBe(ERROR_MESSAGE)
//   })
// })

// test(`${RULE} should find no errors`, async () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {},
//     definitions: {
//       Resource: {
//         properties: {
//           properties: {},
//           systemData: {
//             $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/systemData",
//           },
//           SystemData: {
//             $ref: "../../../../../common-types/resource-management/v13/types.json#/definitions/systemData",
//           },
//         },
//       },
//     },
//   }
//   return nonResolvingLinter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(0)
//   })
// })

test(`${RULE} should find errors one level nesting`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          // properties bag
          properties: {
            systemData: {
              $ref: "#/definitions/ResourceProperties",
            },
          },
        },
      },
      ResourceProperties: {
        properties: {
          systemData: {
            $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/systemData",
          },
        },
      },
    },
  }
  return nonResolvingLinter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
  })
})

test(`${RULE} should find errors`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          // properties bag
          properties: {
            systemData: {
              $ref: "#/definitions/ResourceProperties",
            },
          },
        },
      },
      ResourceProperties: {
        properties: {
          systemData: {
            $ref: "../../../../../common-types/resource-management/v2/types.json#/definitions/systemData",
          },
        },
      },
    },
  }
  return nonResolvingLinter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
