import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral
const RULE = "BillingDataInPropertiesBag"
const ERROR_MESSAGE = "The 'BillingData' property is not allowed in the resource properties bag."

beforeAll(async () => {
  linter = await linterForRule(RULE)
  return linter
})

test(`${RULE} should find no errors when billingData is absent from the properties bag`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          properties: {
            provisioningState: {
              type: "string",
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

test(`${RULE} should find errors when billingData references a model definition`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          properties: {
            billingData: {
              $ref: "#/definitions/BillingData",
            },
          },
        },
      },
      BillingData: {
        type: "object",
        properties: {
          amount: {
            type: "number",
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("definitions.Resource.properties.properties.billingData")
    expect(results[0].message).toBe(ERROR_MESSAGE)
  })
})

test(`${RULE} should find errors when billingData is a primitive type`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          properties: {
            billingData: {
              type: "string",
            },
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("definitions.Resource.properties.properties.billingData")
    expect(results[0].message).toBe(ERROR_MESSAGE)
  })
})

test(`${RULE} should find errors when billingData is an inline model`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          properties: {
            billingData: {
              type: "object",
              properties: {
                amount: {
                  type: "number",
                },
              },
            },
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("definitions.Resource.properties.properties.billingData")
    expect(results[0].message).toBe(ERROR_MESSAGE)
  })
})

test(`${RULE} should be case-insensitive when matching the property name`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          properties: {
            BillingData: {
              type: "string",
            },
            BILLINGDATA: {
              type: "string",
            },
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("definitions.Resource.properties.properties.BillingData")
    expect(results[1].path.join(".")).toBe("definitions.Resource.properties.properties.BILLINGDATA")
    expect(results[0].message).toBe(ERROR_MESSAGE)
    expect(results[1].message).toBe(ERROR_MESSAGE)
  })
})

test(`${RULE} should not flag properties that only contain 'billingData' as a substring`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          properties: {
            billingDataId: {
              type: "string",
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

test(`${RULE} should find errors when billingData is in a referenced properties definition`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          properties: {
            $ref: "#/definitions/ResourceProperties",
          },
        },
      },
      ResourceProperties: {
        properties: {
          billingData: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("definitions.Resource.properties.properties.properties.billingData")
    expect(results[0].message).toBe(ERROR_MESSAGE)
  })
})

test(`${RULE} should not flag billingData defined as a top-level property outside the properties bag`, async () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {},
    definitions: {
      Resource: {
        properties: {
          properties: {
            provisioningState: {
              type: "string",
            },
          },
          billingData: {
            type: "string",
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
