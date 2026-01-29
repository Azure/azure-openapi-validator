import {Spectral} from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("MutabilityWithReadOnly");
  return linter;
});

test("MutabilityWithReadOnly should find errors", () => {
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
      LroStatusCodeSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["read", "update"],
          },
          length: {
            type: "string",
            readOnly: false,
            "x-ms-mutability": ["read"],
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].message).toBe(`When property is modeled as "readOnly": true then x-ms-mutability extension can only have "read" value. When property is modeled as "readOnly": false then applying x-ms-mutability extension with only "read" value is not allowed. Extension contains invalid values: 'read'.`);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.responses.200.schema.properties.length");
    expect(results[1].message).toBe(`When property is modeled as "readOnly": true then x-ms-mutability extension can only have "read" value. When property is modeled as "readOnly": false then applying x-ms-mutability extension with only "read" value is not allowed. Extension contains invalid values: 'read, update'.`);
    expect(results[1].path.join(".")).toBe("paths./api/Paths.put.responses.200.schema.properties.name");
  });
});

test("MutabilityWithReadOnly should find no errors", () => {
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
      LroStatusCodeSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["read"],
          },
          length: {
            type: "string",
            readOnly: false,
            "x-ms-mutability": ["read", "update"],
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

test("MutabilityWithReadOnly should ignore empty x-ms-mutability arrays", () => {
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
      LroStatusCodeSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": [],
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    // Empty x-ms-mutability arrays should be ignored (no errors)
    expect(results.length).toBe(0);
  });
});

test("MutabilityWithReadOnly: readOnly true with valid combinations", () => {
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
        properties: {
          validProp: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["read"],
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

test("MutabilityWithReadOnly: readOnly true with invalid combinations", () => {
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
        properties: {
          invalidUpdate: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["update"],
          },
          invalidCreate: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["create"],
          },
          invalidReadCreate: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["read", "create"],
          },
          invalidAll: {
            type: "string",
            readOnly: true,
            "x-ms-mutability": ["read", "create", "update"],
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(4);
    // Check that all errors are for readOnly true violations
    results.forEach((result) => {
      expect(result.message).toContain('When property is modeled as "readOnly": true');
    });
  });
});

test("MutabilityWithReadOnly: readOnly false with valid combinations", () => {
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
        properties: {
          validReadCreate: {
            type: "string",
            readOnly: false,
            "x-ms-mutability": ["read", "create"],
          },
          validUpdate: {
            type: "string",
            readOnly: false,
            "x-ms-mutability": ["update"],
          },
          validCreate: {
            type: "string",
            readOnly: false,
            "x-ms-mutability": ["create"],
          },
          validAll: {
            type: "string",
            readOnly: false,
            "x-ms-mutability": ["read", "create", "update"],
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

test("MutabilityWithReadOnly: readOnly false with only read is invalid", () => {
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
        properties: {
          invalidReadOnly: {
            type: "string",
            readOnly: false,
            "x-ms-mutability": ["read"],
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toContain('When property is modeled as "readOnly": false');
    expect(results[0].message).toContain("Extension contains invalid values: 'read'");
  });
});
