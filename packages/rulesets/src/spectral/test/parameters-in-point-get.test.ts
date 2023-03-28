import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("ParametersInPointGet")
  return linter
})

test("ParametersInPointGet should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}": {
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
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}.get.parameters")
    expect(results[0].message).toContain(
      "quotaBucketName is a query parameter. Point Get's MUST not have query parameters other than api version."
    )
  })
})

test("ParametersInPointGet should find errors for more than one query param", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}": {
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
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}.get.parameters")
    expect(results[0].message).toContain(
      "loadTestName is a query parameter. Point Get's MUST not have query parameters other than api version."
    )
    expect(results[1].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}.get.parameters")
    expect(results[1].message).toContain(
      "quotaBucketName is a query parameter. Point Get's MUST not have query parameters other than api version."
    )
  })
})

test("ParametersInPointGet should flag error for other query params but should not flag error for api-version param", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}": {
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
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}.get.parameters")
    expect(results[0].message).toContain(
      "quotaBucketName is a query parameter. Point Get's MUST not have query parameters other than api version."
    )
  })
})

test("ParametersInPointGet should not flag error when only api-version param is specified", () => {
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

test("ParametersInPointGet should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}": {
        get: {
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

test("ParametersInPointGet should find no errors for a list operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs": {
        get: {
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
      "/providers/Microsoft.Music/songs/{unstoppable}/artist": {
        get: {
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

test("ParametersInPointGet should find no errors for a non get operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}": {
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

test("ParametersInPointGet should find errors for x-ms-paths", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    "x-ms-paths": {
      "/providers/Microsoft.Music/songs/{unstoppable}?disambiguation_dummy": {
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
    expect(results[0].path.join(".")).toBe("x-ms-paths./providers/Microsoft.Music/songs/{unstoppable}?disambiguation_dummy.get.parameters")
    expect(results[0].message).toContain(
      "quotaBucketName is a query parameter. Point Get's MUST not have query parameters other than api version."
    )
  })
})
