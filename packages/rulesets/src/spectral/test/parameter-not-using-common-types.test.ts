import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let nonResolvingLinter: Spectral

beforeAll(async () => {
  nonResolvingLinter = await linterForRule("ParameterNotUsingCommonTypes", true)
  return nonResolvingLinter
})

test("ParameterNotUsingCommonTypes should find errors path parameters", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Path_Get",
          parameters: [
            {
              name: "location",
              in: "path",
              required: true,
              type: "string",
              description: "test location",
            },
            {
              name: "scope",
              in: "path",
              required: true,
              type: "string",
              description: "test scope",
            },
          ],
          responses: {
            200: {
              description: "Success",
            },
          },
        },
        put: {
          operationId: "Path_Put",
          parameters: [
            {
              name: "api-version",
              in: "path",
              required: true,
              type: "string",
              description: "test location",
            },
          ],
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
    },
    parameters: {
      ServiceNameParameter: {
        name: "serviceName",
        in: "path",
        description: "The name of the Service resource.",
        required: true,
        type: "string",
      },
    },
  }
  const ret = nonResolvingLinter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].path.join(".")).toBe("paths./api/Paths.get.parameters.0.name")
    expect(results[0].message).toContain('Not using the common-types defined parameter "location".')
    expect(results[1].path.join(".")).toBe("paths./api/Paths.get.parameters.1.name")
    expect(results[1].message).toContain('Not using the common-types defined parameter "scope".')
    expect(results[2].path.join(".")).toBe("paths./api/Paths.put.parameters.0.name")
    expect(results[2].message).toContain('Not using the common-types defined parameter "api-version".')
  })
  return ret
})

test("ParameterNotUsingCommonTypes should find errors global parameters", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Path_Get",
          parameters: [
            {
              $ref: "#/parameters/SubscriptionIdParameter",
            },
            {
              $ref: "#/parameters/ApiVersionParameter",
            },
          ],
          responses: {
            200: {
              description: "Success",
            },
          },
        },
        put: {
          operationId: "Path_Put",
          parameters: [
            {
              $ref: "#/parameters/ApiVersionParameter",
            },
          ],
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
    },
    parameters: {
      SubscriptionIdParameter: {
        name: "subscriptionId",
        in: "path",
        required: true,
        type: "string",
        description: "test subscription id",
      },
      ApiVersionParameter: {
        name: "api-version",
        in: "path",
        required: true,
        type: "string",
        description: "test api version",
      },
    },
  }
  return nonResolvingLinter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("parameters.SubscriptionIdParameter.name")
    expect(results[0].message).toContain('Not using the common-types defined parameter "subscriptionId".')
    expect(results[1].path.join(".")).toBe("parameters.ApiVersionParameter.name")
    expect(results[1].message).toContain('Not using the common-types defined parameter "api-version".')
  })
})

test("ParameterNotUsingCommonTypes should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Path_Get",
          parameters: [
            {
              $ref: "../../../../../common-types/resource-management/v2/types.json#/parameters/ApiVersionParameter",
            },
            {
              $ref: "../../../../../common-types/resource-management/v3/types.json#/parameters/SubscriptionIdParameter",
            },
            {
              $ref: "../../../../../common-types/resource-management/v4/types.json#/parameters/ResourceGroupNameParameter",
            },
            {
              name: "testScope",
              in: "path",
              required: true,
              type: "string",
              description: "test scope",
            },
          ],
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
    },
    parameters: {
      ServiceNameParameter: {
        name: "serviceName",
        in: "path",
        description: "The name of the Service resource.",
        required: true,
        type: "string",
      },
    },
  }
  return nonResolvingLinter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
