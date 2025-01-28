import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = linterForRule("SuggestScopeParameter")
  return linter
})

test("SuggestScopeParameter should find errors for subscription and resource group scopes", async () => {
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

  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2)

    // all errors should have the same message
    expect(new Set(results.map((r) => r.message)).size).toBe(1)

    // each path should have an error
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Bakery/breads",
    )
    expect(results[1].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/Microsoft.Bakery/breads")
  })
})

test("SuggestScopeParameter should find no errors with scope parameter", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/{scope}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/ScopeParameter" }],
        },
      },
    },
    parameters: {
      ScopeParameter: {
        name: "scope",
        in: "path",
        required: true,
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("SuggestScopeParameter should find no errors with different resourcetypes", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/SubscriptionIdParameter" }, { $ref: "#/parameters/ResourceGroupParameter" }],
        },
      },
      "/subscriptions/{subscriptionId}/providers/Microsoft.Bakery/cookies": {
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
      ScopeParameter: {
        name: "scope",
        in: "path",
        required: true,
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("SuggestScopeParameter should find errors for billing scope", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/{scope}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/ScopeParameter" }],
        },
      },
      "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }],
        },
      },
      "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/departments/{departmentId}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/DepartmentIdParameter" }],
        },
      },
      "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/enrollmentAccounts/{enrollmentAccountId}/providers/Microsoft.Bakery/breads":
        {
          get: {
            parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/EnrollmentAccountIdParameter" }],
          },
        },
      "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/providers/Microsoft.Bakery/breads":
        {
          get: {
            parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/BillingProfileIdParameter" }],
          },
        },
      "providers/Microsoft.Billing/billingAccounts/{billingAccountId}/invoiceSections/{invoiceSectionId}/providers/Microsoft.Bakery/breads":
        {
          get: {
            parameters: [{ $ref: "#/parameters/BillingAccountIdParameter" }, { $ref: "#/parameters/InvoiceSectionIdParameter" }],
          },
        },
    },
    parameters: {
      ScopeParameter: {
        name: "scope",
        in: "path",
        required: true,
      },
      BillingAccountIdParameter: {
        name: "billAcc",
        in: "path",
        required: true,
      },
      DepartmentIdParameter: {
        name: "test",
        in: "path",
        required: true,
      },
      EnrollmentAccountIdParameter: {
        name: "enrollmentAcc",
        in: "path",
        required: true,
      },
      BillingProfileIdParameter: {
        name: "billProf",
        in: "path",
        required: true,
      },
      InvoiceSectionIdParameter: {
        name: "invoiceSection",
        in: "path",
        required: true,
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(5)

    // all errors should have the same message
    expect(new Set(results.map((r) => r.message)).size).toBe(1)

    // each path besides the one with the scope parameter should have an error
    expect(results[0].path.join(".")).toBe(
      "paths.providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Bakery/breads",
    )
    expect(results[1].path.join(".")).toBe(
      "paths.providers/Microsoft.Billing/billingAccounts/{billingAccountId}/departments/{departmentId}/providers/Microsoft.Bakery/breads",
    )
    expect(results[2].path.join(".")).toBe(
      "paths.providers/Microsoft.Billing/billingAccounts/{billingAccountId}/enrollmentAccounts/{enrollmentAccountId}/providers/Microsoft.Bakery/breads",
    )
    expect(results[3].path.join(".")).toBe(
      "paths.providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}/providers/Microsoft.Bakery/breads",
    )
    expect(results[4].path.join(".")).toBe(
      "paths.providers/Microsoft.Billing/billingAccounts/{billingAccountId}/invoiceSections/{invoiceSectionId}/providers/Microsoft.Bakery/breads",
    )
  })
})

test("SuggestScopeParameter should not find errors for list and point get paths", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/{scope}/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [{ $ref: "#/parameters/ScopeParameter" }],
        },
      },
      "/{scope}/providers/Microsoft.Bakery/breads/{breadName}": {
        get: {
          parameters: [{ $ref: "#/parameters/ScopeParameter" }],
        },
      },
    },
    parameters: {
      ScopeParameter: {
        name: "scope",
        in: "path",
        required: true,
      },
    },
  }

  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("SuggestScopeParameter should find errors for tenant level scope", async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Bakery/breads": {
        get: {
          parameters: [
            {
              name: "body_param",
              in: "body",
              schema: {
                properties: { prop: { type: "string" } },
              },
            },
          ],
        },
      },
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

  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3)

    // all errors should have the same message
    expect(new Set(results.map((r) => r.message)).size).toBe(1)

    // each path should have an error
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Bakery/breads")
    expect(results[1].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Bakery/breads",
    )
    expect(results[2].path.join(".")).toBe("paths./subscriptions/{subscriptionId}/providers/Microsoft.Bakery/breads")
  })
})
