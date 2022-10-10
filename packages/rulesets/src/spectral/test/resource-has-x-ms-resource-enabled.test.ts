import { Spectral } from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("ResourceHasXMsResourceEnabled");
  return linter;
});

test("ResourceHasXMsResourceEnabled should find errors when there's no x-ms-azure-resource extension", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/LroStatusCodeSchema",
              },
            },
          },
        },
      },
    },
    definitions: {
      Resource: {
        properties: {
          id: {
            type: "string",
            readOnly: true,
            description: "Resource Id",
          },
        },
      },
      LroStatusCodeSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["read", "update"],
          },
          resource: {
            type: "object",
            schema: {
              $ref: "#/definitions/Resource",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(
      `A 'Resource' definition must have x-ms-azure-resource extension enabled and set to true.`
    );
    expect(results[0].path.join(".")).toBe("definitions.Resource");
  });
});

test("ResourceHasXMsResourceEnabled should find errors when x-ms-azure-resource is false", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/LroStatusCodeSchema",
              },
            },
          },
        },
      },
    },
    definitions: {
      Resource: {
        "x-ms-azure-resource": false,
        properties: {
          id: {
            type: "string",
            readOnly: true,
            description: "Resource Id",
          },
        },
      },
      LroStatusCodeSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["read", "update"],
          },
          resource: {
            type: "object",
            schema: {
              $ref: "#/definitions/Resource",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(
      `A 'Resource' definition must have x-ms-azure-resource extension enabled and set to true.`
    );
    expect(results[0].path.join(".")).toBe("definitions.Resource.x-ms-azure-resource");
  });
});

test("ResourceHasXMsResourceEnabled should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
              schema: {
                $ref: "#/definitions/LroStatusCodeSchema",
              },
            },
          },
        },
      },
    },
    definitions: {
      Resource: {
        "x-ms-azure-resource": true,
        properties: {
          id: {
            type: "string",
            readOnly: true,
            description: "Resource Id",
          },
        },
      },
      LroStatusCodeSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["read", "update"],
          },
          resource: {
            type: "object",
            schema: {
              $ref: "#/definitions/Resource",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
