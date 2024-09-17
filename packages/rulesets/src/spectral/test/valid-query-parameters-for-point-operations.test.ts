import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("ValidQueryParametersForPointOperations")
  return linter
})

test("ValidQueryParametersForPointOperations should find errors for top level path", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}": {
        get: {
          operationId: "foo_get",
          parameters: [
            {
              $ref: "#/parameters/QuotaBucketNameParameter",
            },
          ],
        },
        delete: {
          operationId: "foo_delete",
          parameters: [
            {
              $ref: "#/parameters/QuotaBucketNameParameter",
            },
          ],
        },
      },
      "/providers/Microsoft.Music/Albums/{Great}": {
        get: {
          operationId: "foo_get",
          parameters: [
            {
              $ref: "#/parameters/QuotaBucketNameParameter",
            },
          ],
        },
        put: {
          operationId: "foo_put",
          parameters: [
            {
              $ref: "#/parameters/QuotaBucketNameParameter",
            },
          ],
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
    expect(results.length).toBe(4)
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}.get.parameters")
    expect(results[0].message).toContain(
      "Query parameter quotaBucketName should be removed. Point operation 'get' MUST not have query parameters other than api-version.",
    )
    expect(results[1].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}.delete.parameters")
    expect(results[1].message).toContain(
      "Query parameter quotaBucketName should be removed. Point operation 'delete' MUST not have query parameters other than api-version.",
    )
    expect(results[2].path.join(".")).toBe("paths./providers/Microsoft.Music/Albums/{Great}.get.parameters")
    expect(results[2].message).toContain(
      "Query parameter quotaBucketName should be removed. Point operation 'get' MUST not have query parameters other than api-version.",
    )
    expect(results[3].path.join(".")).toBe("paths./providers/Microsoft.Music/Albums/{Great}.put.parameters")
    expect(results[3].message).toContain(
      "Query parameter quotaBucketName should be removed. Point operation 'put' MUST not have query parameters other than api-version.",
    )
  })
})

test("ValidQueryParametersForPointOperations should find errors for nested path", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}": {
        get: {
          operationId: "foo_get",
          parameters: [
            {
              $ref: "#/parameters/QuotaBucketNameParameter",
            },
          ],
        },
        put: {
          operationId: "foo_put",
          parameters: [
            {
              $ref: "#/parameters/QuotaBucketNameParameter",
            },
          ],
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
    expect(results.length).toBe(2)
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}.get.parameters")
    expect(results[0].message).toContain(
      "Query parameter quotaBucketName should be removed. Point operation 'get' MUST not have query parameters other than api-version.",
    )
    expect(results[1].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}.put.parameters")
    expect(results[1].message).toContain(
      "Query parameter quotaBucketName should be removed. Point operation 'put' MUST not have query parameters other than api-version.",
    )
  })
})

test("ValidQueryParametersForPointOperations should find errors for more than one query param", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}": {
        get: {
          operationId: "foo_get",
          parameters: [
            {
              $ref: "#/parameters/LoadTestNameParameter",
            },
            {
              $ref: "#/parameters/QuotaBucketNameParameter",
            },
          ],
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
      "Query parameter loadTestName should be removed. Point operation 'get' MUST not have query parameters other than api-version.",
    )
    expect(results[1].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}.get.parameters")
    expect(results[1].message).toContain(
      "Query parameter quotaBucketName should be removed. Point operation 'get' MUST not have query parameters other than api-version.",
    )
  })
})

test("ValidQueryParametersForPointOperations should flag error for other query params but should not flag error for api-version param", () => {
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
    expect(results[0].path.join(".")).toBe("paths./providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}.get.parameters")
    expect(results[0].message).toContain(
      "Query parameter quotaBucketName should be removed. Point operation 'get' MUST not have query parameters other than api-version.",
    )
  })
})

test("ValidQueryParametersForPointOperations should find no errors when query parameters are not present", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/providers/Microsoft.Music/songs/{unstoppable}/artist/{sia}": {
        put: {
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
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("ValidQueryParametersForPointOperations should find no errors for a list operation", () => {
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
      "/providers/Microsoft.Music/songs/{unstoppable}/artist": {
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

test("ValidQueryParametersForPointOperations should find errors for x-ms-paths", () => {
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
    expect(results[0].path.join(".")).toBe("x-ms-paths./providers/Microsoft.Music/songs/{unstoppable}?disambiguation_dummy.get.parameters")
    expect(results[0].message).toContain(
      "Query parameter quotaBucketName should be removed. Point operation 'get' MUST not have query parameters other than api-version.",
    )
  })
})

test("ValidQueryParametersForPointOperations should find no errors if parameters is not defined", () => {
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
