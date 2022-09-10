import { Spectral } from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("RequiredReadOnlyProperties");
  return linter;
});

test("RequiredReadOnlyProperties should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Paths_listPath",
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/ResponseResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      ResponseResource: {
        properties: {
          id: {
            readOnly: true,
            type: "string",
            description: "Resource Id",
          },
          name: {
            readOnly: true,
            type: "string",
            description: "Resource name",
          },
          type: {
            readOnly: true,
            type: "string",
            description: "Resource type",
          },
          location: {
            type: "string",
            description: "Resource location",
          },
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Resource tags",
          },
        },
        required: ["location", "name"],
        description: "The Resource definition.",
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(
      "Property 'name' is a required property. It should not be marked as 'readonly'"
    );
    expect(results[0].path.join(".")).toBe("definitions.ResponseResource");
  });
});

test("RequiredReadOnlyProperties should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Paths_listPath",
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/ResponseResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      ResponseResource: {
        properties: {
          id: {
            readOnly: true,
            type: "string",
            description: "Resource Id",
          },
          name: {
            type: "string",
            description: "Resource name",
          },
          type: {
            readOnly: true,
            type: "string",
            description: "Resource type",
          },
          location: {
            type: "string",
            description: "Resource location",
          },
          tags: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Resource tags",
          },
        },
        required: ["location", "name"],
        description: "The Resource definition.",
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
