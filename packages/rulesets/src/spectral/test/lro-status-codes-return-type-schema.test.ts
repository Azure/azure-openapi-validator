import {Spectral} from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("LroStatusCodesReturnTypeSchema");
  return linter;
});

test("LroStatusCodesReturnTypeSchema should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.responses.200");
  });
});

test("LroStatusCodesReturnTypeSchema should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          "x-ms-long-running-operation": true,
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
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
