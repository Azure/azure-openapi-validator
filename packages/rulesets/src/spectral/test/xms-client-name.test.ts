import { Spectral } from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("XmsClientName");
  return linter;
});

test("XmsClientName should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          parameters: [
            {
              name: "resourceGroupName",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the resource group.",
              "x-ms-client-name": "resource-group-name",
            },
            {
              name: "name",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the Redis cache.",
              "x-ms-client-name": "name",
            },
          ],
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
            "x-ms-client-name": "length",
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].message).toBe(`Value of 'x-ms-client-name' cannot be the same as 'name' Property/Model.`);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.parameters.1");
    expect(results[1].message).toBe(`Value of 'x-ms-client-name' cannot be the same as 'length' Property/Model.`);
    expect(results[1].path.join(".")).toBe("paths./api/Paths.put.responses.200.schema.properties.length");
  });
});

test("XmsClientName should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          parameters: [
            {
              name: "resourceGroupName",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the resource group.",
              "x-ms-client-name": "resource-group-name",
            },
            {
              name: "name",
              in: "path",
              required: true,
              type: "string",
              description: "The name of the Redis cache.",
              "x-ms-client-name": "Name",
            },
          ],
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
            "x-ms-client-name": "Length",
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
