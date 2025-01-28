import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

//beforeAll(() => linterForRule("SuggestScopeParameter"))

beforeAll(async () => {
  linter = await linterForRule("SuggestScopeParameter")
  return linter
})

test("SuggestScopeParameter should find errors", async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/SubscriptionIdParameter" }, { $ref: "#/parameters/ResourceGroupParameter" }],
        },
      },
      "/subscriptions/{subscriptionId}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/SubscriptionIdParameter" }],
        },
      },
    },
    parameters: {
      SubscriptionIdParameter: {
        name: "subscriptionId",
        in: "path",
        required: true,
      },
      ResourceGroupParameter: {
        name: "resourceGroupName",
        in: "path",
        required: true,
      },
    },
  }

  let result

  try {
    result = await linter.run(oasDoc).then((results) => {
      const paths = Object.keys(oasDoc.paths)
      expect(results.length).toBe(2)

      // path 0
      expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Bakery/breads")
      expect(results[0].message).toContain(`Path "${paths[0]}" differs from path "${paths[1]}" only in scope`)
      //expect(results[0].message).toContain(`"${paths[2]}" that has the scope parameter`)

      // path 1
      //expect(results[1].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
      //expect(results[1].message).toContain(`"${paths[1]}" with explicitly defined scope`)
      //expect(results[1].message).toContain(`"${paths[2]}" that has the scope parameter`)
    })
  } catch (error) {
    if (error && error.errors && Array.isArray(error.errors)) {
      throw new Error(`Errors found. ${error.errors}`)
    }
  }
  return result
})

// test("NoDuplicatePathsForScopeParameter should find no errors with scope parameter", () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {
//       "/{scope}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/ScopeParameter" }],
//         },
//       },
//     },
//     parameters: {
//       ScopeParameter: {
//         name: "scope",
//         in: "path",
//         required: true,
//       },
//     },
//   }
//   return linter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(0)
//   })
// })

// test("NoDuplicatePathsForScopeParameter should find no errors with explicitly defined scopes", () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {
//       "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/SubscriptionIdParameter" }, { $ref: "#/parameters/ResourceGroupParameter" }],
//         },
//       },
//       "/subscriptions/{subscriptionId}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/SubscriptionIdParameter" }],
//         },
//       },
//     },
//     parameters: {
//       SubscriptionIdParameter: {
//         name: "subscriptionId",
//         in: "path",
//         required: true,
//       },
//       ResourceGroupParameter: {
//         name: "resourceGroupName",
//         in: "path",
//         required: true,
//       },
//       ScopeParameter: {
//         name: "scope",
//         in: "path",
//         required: true,
//       },
//     },
//   }
//   return linter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(0)
//   })
// })

// test("NoDuplicatePathsForScopeParameter should find errors for billing scope", () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {
//       "/{scope}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/ScopeParameter" }],
//         },
//       },
//       "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }],
//         },
//       },
//       "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/departments/{departmentId}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/DepartmentIdParameter" }],
//         },
//       },
//       "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/enrollmentAccounts/{enrollmentAccountId}/providers/Microsoft.Bakery/breads":
//         {
//           get: {
//             parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/EnrollmentAccountIdParameter" }],
//           },
//         },
//       "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/providers/Microsoft.Bakery/breads":
//         {
//           get: {
//             parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/BillingProfileIdParameter" }],
//           },
//         },
//       "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/invoiceSections/{invoiceSectionId}/providers/Microsoft.Bakery/breads":
//         {
//           get: {
//             parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/InvoiceSectionIdParameter" }],
//           },
//         },
//     },
//     parameters: {
//       ScopeParameter: {
//         name: "scope",
//         in: "path",
//         required: true,
//       },
//       BillingAccountIdParameter: {
//         name: "billAcc",
//         in: "path",
//         required: true,
//       },
//       DepartmentIdParameter: {
//         name: "test",
//         in: "path",
//         required: true,
//       },
//       EnrollmentAccountIdParameter: {
//         name: "enrollmentAcc",
//         in: "path",
//         required: true,
//       },
//       BillingProfileIdParameter: {
//         name: "billProf",
//         in: "path",
//         required: true,
//       },
//       InvoiceSectionIdParameter: {
//         name: "invoiceSection",
//         in: "path",
//         required: true,
//       },
//     },
//   }
//   return linter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(5)
//     // explicitly not using a loop here to keep the test logic basic
//     const paths = Object.keys(oasDoc.paths)
//     // path 1
//     expect(results[0].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
//     expect(results[0].message).toContain(`"${paths[1]}" with explicitly defined scope`)
//     expect(results[0].message).toContain(`"${paths[0]}" that has the scope parameter`)
//     // path 2
//     expect(results[1].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
//     expect(results[1].message).toContain(`"${paths[2]}" with explicitly defined scope`)
//     expect(results[1].message).toContain(`"${paths[0]}" that has the scope parameter`)
//     // path 3
//     expect(results[2].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
//     expect(results[2].message).toContain(`"${paths[3]}" with explicitly defined scope`)
//     expect(results[2].message).toContain(`"${paths[0]}" that has the scope parameter`)
//     // path 4
//     expect(results[3].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
//     expect(results[3].message).toContain(`"${paths[4]}" with explicitly defined scope`)
//     expect(results[3].message).toContain(`"${paths[0]}" that has the scope parameter`)
//     // path 5
//     expect(results[4].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
//     expect(results[4].message).toContain(`"${paths[5]}" with explicitly defined scope`)
//     expect(results[4].message).toContain(`"${paths[0]}" that has the scope parameter`)
//   })
// })

// test("NoDuplicatePathsForScopeParameter should not find errors for billing scope", () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {
//       "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }],
//         },
//       },
//       "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/departments/{departmentId}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/DepartmentIdParameter" }],
//         },
//       },
//       "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/enrollmentAccounts/{enrollmentAccountId}/providers/Microsoft.Bakery/breads":
//         {
//           get: {
//             parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/EnrollmentAccountIdParameter" }],
//           },
//         },
//       "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/providers/Microsoft.Bakery/breads":
//         {
//           get: {
//             parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/BillingProfileIdParameter" }],
//           },
//         },
//       "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/invoiceSections/{invoiceSectionId}/providers/Microsoft.Bakery/breads":
//         {
//           get: {
//             parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/InvoiceSectionIdParameter" }],
//           },
//         },
//     },
//     parameters: {
//       BillingAccountIdParameter: {
//         name: "billAcc",
//         in: "path",
//         required: true,
//       },
//       DepartmentIdParameter: {
//         name: "test",
//         in: "path",
//         required: true,
//       },
//       EnrollmentAccountIdParameter: {
//         name: "enrollmentAcc",
//         in: "path",
//         required: true,
//       },
//       BillingProfileIdParameter: {
//         name: "billProf",
//         in: "path",
//         required: true,
//       },
//       InvoiceSectionIdParameter: {
//         name: "invoiceSection",
//         in: "path",
//         required: true,
//       },
//     },
//   }
//   return linter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(0)
//   })
// })

// test("NoDuplicatePathsForScopeParameter should find errors for other scopes", () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {
//       "/{scope}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/ScopeParameter" }],
//         },
//       },
//       "providers/Microsoft.Management/managementGroups/{managementGroupId}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/ManagementGroupIdParameter" }],
//         },
//       },
//       "providers/Microsoft.CostManagement/externalBillingAccounts/{externalBillingAccountName}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/ExternalBillingAccountNameParameter" }],
//         },
//       },
//       "providers/Microsoft.CostManagement/externalSubscriptions/{externalSubscriptionName}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/ExternalSubscriptionNameParameter" }],
//         },
//       },
//     },
//     parameters: {
//       ScopeParameter: {
//         name: "scope",
//         in: "path",
//         required: true,
//       },
//       ManagementGroupIdParameter: {
//         name: "billAcc",
//         in: "path",
//         required: true,
//       },
//       ExternalBillingAccountNameParameter: {
//         name: "test",
//         in: "path",
//         required: true,
//       },
//       ExternalSubscriptionNameParameter: {
//         name: "enrollmentAcc",
//         in: "path",
//         required: true,
//       },
//     },
//   }
//   return linter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(3)
//     // explicitly not using a loop here to keep the test logic basic
//     const paths = Object.keys(oasDoc.paths)
//     // path 1
//     expect(results[0].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
//     expect(results[0].message).toContain(`"${paths[1]}" with explicitly defined scope`)
//     expect(results[0].message).toContain(`"${paths[0]}" that has the scope parameter`)
//     // path 2
//     expect(results[1].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
//     expect(results[1].message).toContain(`"${paths[2]}" with explicitly defined scope`)
//     expect(results[1].message).toContain(`"${paths[0]}" that has the scope parameter`)
//     // path 3
//     expect(results[2].path.join(".")).toBe("paths./{scope}/providers/Microsoft.Bakery/breads")
//     expect(results[2].message).toContain(`"${paths[3]}" with explicitly defined scope`)
//     expect(results[2].message).toContain(`"${paths[0]}" that has the scope parameter`)
//   })
// })

// test("NoDuplicatePathsForScopeParameter should not find errors for list and point get paths", () => {
//   const oasDoc = {
//     swagger: "2.0",
//     paths: {
//       "/{scope}/providers/Microsoft.Bakery/breads": {
//         get: {
//           parameters: [{ $ref: "#/parameters/ScopeParameter" }],
//         },
//       },
//       "/{scope}/providers/Microsoft.Bakery/breads/{breadName}": {
//         get: {
//           parameters: [{ $ref: "#/parameters/ScopeParameter" }],
//         },
//       },
//     },
//     parameters: {
//       ScopeParameter: {
//         name: "scope",
//         in: "path",
//         required: true,
//       },
//     },
//   }

//   return linter.run(oasDoc).then((results) => {
//     expect(results.length).toBe(0)
//   })
// })
