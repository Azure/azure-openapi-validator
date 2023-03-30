import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("LatestVersionOfCommonTypesMustBeUsed")
  return linter
})

test("LatestVersionOfCommonTypesMustBeUsed should find errors for obsolete version", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        get: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "../../../../../common-types/resource-management/v3/customermanagedkeys.json#/parameters/ApiVersionParameter",
            },
            {
              $ref: "../../../../../common-types/resource-management/v1/managedidentity.json#/parameters/ApiVersionParameter",
            },
          ],
          responses: {
            200: {
              description: "Success",
              $ref: "../../../../../common-types/resource-management/v4/types.json#/parameters/ApiVersionParameter",
            },
          },
        },
      },
    },
    parameters: {
      LoadTestNameParameter: {
        in: "path",
        name: "loadTestName",
        description: "Load Test name.",
        required: true,
        "x-ms-parameter-location": "method",
        type: "string",
      },
      QuotaBucketNameParameter: {
        in: "query",
        name: "quotaBucketName",
        description: "Quota Bucket name.",
        required: true,
        "x-ms-parameter-location": "method",
        type: "string",
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    const desiredResults = results.filter((result) => result.message.includes("Use the latest version"))
    expect(desiredResults.length).toBe(3)
    expect(desiredResults[0].path.join(".")).toBe("paths./foo.get.parameters.0.$ref")
    expect(desiredResults[0].message).toContain("Use the latest version v4 of customermanagedkeys.json available under common-types.")
    expect(desiredResults[1].path.join(".")).toBe("paths./foo.get.parameters.1.$ref")
    expect(desiredResults[1].message).toContain("Use the latest version v5 of managedidentity.json available under common-types.")
    expect(desiredResults[2].path.join(".")).toBe("paths./foo.get.responses.200.$ref")
    expect(desiredResults[2].message).toContain("Use the latest version v5 of types.json available under common-types.")
  })
})

test("ParametersInPointGet should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        get: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "../../../../../common-types/resource-management/v4/customermanagedkeys.json#/parameters/ApiVersionParameter",
            },
            {
              $ref: "../../../../../common-types/resource-management/v5/managedidentity.json#/parameters/ApiVersionParameter",
            },
          ],
          responses: {
            200: {
              description: "Success",
              $ref: "../../../../../common-types/resource-management/v5/types.json#/parameters/ApiVersionParameter",
            },
          },
        },
      },
    },
    parameters: {
      LoadTestNameParameter: {
        in: "query",
        name: "loadTestName",
        description: "Load Test name.",
        required: true,
        "x-ms-parameter-location": "method",
        type: "string",
      },
      QuotaBucketNameParameter: {
        in: "query",
        name: "quotaBucketName",
        description: "Quota Bucket name.",
        required: true,
        "x-ms-parameter-location": "method",
        type: "string",
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    const desiredResults = results.filter((result) => result.message.includes("Use the latest version"))
    expect(desiredResults.length).toBe(0)
  })
})
