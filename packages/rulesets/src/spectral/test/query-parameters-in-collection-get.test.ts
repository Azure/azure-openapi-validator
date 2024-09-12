import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("QueryParametersInCollectionGet")
  return linter
})

test("QueryParametersInCollectionGet should find errors for top level path", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs": {
        get: {
          operationId: "foo_post",
          parameters: [
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
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs.get.parameters")
    expect(results[0].message).toContain(
      "Query parameter quotaBucketName should be removed. Collection Get's/List operation MUST not have query parameters other than api version & OData filter.",
    )
  })
})

test("QueryParametersInCollectionGet should find errors for nested path", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artists": {
        get: {
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
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artists.get.parameters")
    expect(results[0].message).toContain(
      "Query parameter quotaBucketName should be removed. Collection Get's/List operation MUST not have query parameters other than api version & OData filter.",
    )
  })
})

test("QueryParametersInCollectionGet should find errors for more than one query param", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artists": {
        get: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "#/parameters/LoadTestNameParameter",
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
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artists.get.parameters")
    expect(results[0].message).toContain(
      "Query parameter loadTestName should be removed. Collection Get's/List operation MUST not have query parameters other than api version & OData filter.",
    )
    expect(results[1].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artists.get.parameters")
    expect(results[1].message).toContain(
      "Query parameter quotaBucketName should be removed. Collection Get's/List operation MUST not have query parameters other than api version & OData filter.",
    )
  })
})

test("QueryParametersInCollectionGet should flag error for other query params but should not flag error for api-version param", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artists": {
        get: {
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
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artists.get.parameters")
    expect(results[0].message).toContain(
      "Query parameter quotaBucketName should be removed. Collection Get's/List operation MUST not have query parameters other than api version & OData filter.",
    )
  })
})

test("QueryParametersInCollectionGet should not flag error when only api-version and ODataFilter param are specified", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}": {
        get: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "src/spectral/test/resources/types.json#/parameters/ApiVersionParameter",
            },
            {
              name: "$filter",
              in: "query",
              required: false,
              type: "string",
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
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("QueryParametersInCollectionGet should find no errors for a point get operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}": {
        get: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "src/spectral/test/resources/types.json#/parameters/ResourceGroupNameParameter",
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
      "/providers/Microsoft.Music/songs/{unstoppable}/artists/{Sia}": {
        get: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "src/spectral/test/resources/types.json#/parameters/ResourceGroupNameParameter",
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

test("QueryParametersInCollectionGet should find no errors for a non get operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs": {
        post: {
          operationId: "foo_post",
          parameters: [
            {
              $ref: "src/spectral/test/resources/types.json#/parameters/ResourceGroupNameParameter",
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

test("QueryParametersInCollectionGet should find errors for x-ms-paths", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    "x-ms-paths": {
      "/providers/Microsoft.Music/songs?disambiguation_dummy": {
        get: {
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
    expect(results[0].path.join(".")).toBe("x-ms-paths./providers/Microsoft.Music/songs?disambiguation_dummy.get.parameters")
    expect(results[0].message).toContain(
      "Query parameter quotaBucketName should be removed. Collection Get's/List operation MUST not have query parameters other than api version & OData filter.",
    )
  })
})

test("QueryParametersInCollectionGet should find no errors if parameters is not defined", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}": {
        get: {
          operationId: "foo_post",
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
