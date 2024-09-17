import { Spectral } from "@stoplight/spectral-core"
import { LATEST_VERSION_BY_COMMON_TYPES_FILENAME } from "../functions/utils"
import linterForRule from "./utils"

let nonResolvingLinter: Spectral

beforeAll(async () => {
  nonResolvingLinter = linterForRule("LatestVersionOfCommonTypesMustBeUsed", true)
  return nonResolvingLinter
})

test("LatestVersionOfCommonTypesMustBeUsed should find errors for obsolete version", async () => {
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
  return nonResolvingLinter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(3)
    expect(results[0].path.join(".")).toBe("paths./foo.get.parameters.0.$ref")
    expect(results[0].message).toContain("Use the latest version v5 of customermanagedkeys.json.")
    expect(results[1].path.join(".")).toBe("paths./foo.get.parameters.1.$ref")
    expect(results[1].message).toContain("Use the latest version v6 of managedidentity.json.")
    expect(results[2].path.join(".")).toBe("paths./foo.get.responses.200.$ref")
    expect(results[2].message).toContain("Use the latest version v6 of types.json.")
  })
})

test("LatestVersionOfCommonTypesMustBeUsed should find no errors", async () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        get: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: `../../../../../common-types/resource-management/${LATEST_VERSION_BY_COMMON_TYPES_FILENAME.get(
                "customermanagedkeys.json",
              )}/customermanagedkeys.json#/parameters/ApiVersionParameter`,
            },
            {
              $ref: `../../../../../common-types/resource-management/${LATEST_VERSION_BY_COMMON_TYPES_FILENAME.get(
                "managedidentity.json",
              )}/managedidentity.json#/parameters/ApiVersionParameter`,
            },
          ],
          responses: {
            200: {
              description: "Success",
              $ref: `../../../../../common-types/resource-management/${LATEST_VERSION_BY_COMMON_TYPES_FILENAME.get(
                "types.json",
              )}/types.json#/parameters/ApiVersionParameter`,
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
  return nonResolvingLinter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
test("LatestVersionOfCommonTypesMustBeUsed should find no errors when common-types ref is not present", async () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        get: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "#/parameters/LoadTestNameParameter",
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
  return nonResolvingLinter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
