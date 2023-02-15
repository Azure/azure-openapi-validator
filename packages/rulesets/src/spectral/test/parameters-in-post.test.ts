import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("ParametersInPost")
  return linter
})

test("ParametersInPost should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "src/spectral/test/resources/types.json#/parameters/SubscriptionIdParameter",
            },
            {
              $ref: "#/parameters/QuotaBucketNameParameter",
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
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post.parameters")
    expect(results[0].message).toContain("quotaBucketName is a query parameter. Post operation must not contain query parameters.")
  })
})

test("ParametersInPost should not flag error or api-version type param", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "src/spectral/test/resources/types.json#/parameters/ApiVersionParameter",
            },
            {
              $ref: "#/parameters/QuotaBucketNameParameter",
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
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.post.parameters")
    expect(results[0].message).toContain("quotaBucketName is a query parameter. Post operation must not contain query parameters.")
  })
})

test("ParametersInPost should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/foo": {
        post: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "src/spectral/test/resources/types.json#/parameters/ResourceGroupNameParameter",
            },
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
    expect(results.length).toBe(0)
  })
})
