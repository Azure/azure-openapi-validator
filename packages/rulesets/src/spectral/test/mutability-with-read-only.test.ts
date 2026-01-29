import {Spectral} from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("MutabilityWithReadOnly");
  return linter;
});

// Helper function to create OpenAPI document with properties
const createOpenApiDoc = (properties: unknown) => ({
  swagger: "2.0",
  paths: {
    "/api/Paths": {
      put: {
        operationId: "Path_Create",
        responses: {
          200: {
            description: "Success",
            schema: {
              $ref: "#/definitions/Schema",
            },
          },
        },
      },
    },
  },
  definitions: {
    Schema: {
      type: "object",
      properties,
    },
  },
});

test("MutabilityWithReadOnly: valid combinations", () => {
  const myOpenApiDocument = createOpenApiDoc({
    readOnlyTrueValid: {
      type: "string",
      readOnly: true,
      "x-ms-mutability": ["read"],
    },
    readOnlyFalseValid1: {
      type: "string",
      readOnly: false,
      "x-ms-mutability": ["read", "create"],
    },
    readOnlyFalseValid2: {
      type: "string",
      readOnly: false,
      "x-ms-mutability": ["update"],
    },
    readOnlyFalseValid3: {
      type: "string",
      readOnly: false,
      "x-ms-mutability": ["create"],
    },
    readOnlyFalseValid4: {
      type: "string",
      readOnly: false,
      "x-ms-mutability": ["read", "create", "update"],
    },
  });
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

test("MutabilityWithReadOnly: invalid combinations", () => {
  const myOpenApiDocument = createOpenApiDoc({
    readOnlyTrueInvalid1: {
      type: "string",
      readOnly: true,
      "x-ms-mutability": ["read", "update"],
    },
    readOnlyTrueInvalid2: {
      type: "string",
      readOnly: true,
      "x-ms-mutability": ["update"],
    },
    readOnlyTrueInvalid3: {
      type: "string",
      readOnly: true,
      "x-ms-mutability": ["create"],
    },
    readOnlyTrueInvalid4: {
      type: "string",
      readOnly: true,
      "x-ms-mutability": ["read", "create"],
    },
    readOnlyTrueInvalid5: {
      type: "string",
      readOnly: true,
      "x-ms-mutability": ["read", "create", "update"],
    },
    readOnlyFalseInvalid: {
      type: "string",
      readOnly: false,
      "x-ms-mutability": ["read"],
    },
  });
  return linter.run(myOpenApiDocument).then((results) => {
    // 5 invalid readOnly: true + 1 invalid readOnly: false = 6 total errors
    expect(results.length).toBe(6);
    // Verify all are error messages (not just checking counts since all errors have same message format)
    results.forEach((result) => {
      expect(result.message).toContain("Extension contains invalid values:");
    });
  });
});

test("MutabilityWithReadOnly: properties ignored by given clause", () => {
  const myOpenApiDocument = createOpenApiDoc({
    emptyMutability: {
      type: "string",
      readOnly: true,
      "x-ms-mutability": [],
    },
    onlyReadOnly: {
      type: "string",
      readOnly: true,
    },
    onlyMutability: {
      type: "string",
      "x-ms-mutability": ["read"],
    },
    neitherField: {
      type: "string",
    },
  });
  return linter.run(myOpenApiDocument).then((results) => {
    // All properties should be ignored: empty array, missing field, or both missing
    expect(results.length).toBe(0);
  });
});
