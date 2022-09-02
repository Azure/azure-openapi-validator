import {Spectral} from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("NamePropertyDefinitionInParameter");
  return linter;
});

test("NamePropertyDefinitionInParameter should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          parameters: [
            {
              name: "",
              in: "path",
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
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put.parameters");
  });
});

test("NamePropertyDefinitionInParameter should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          parameters: [
            {
              name: "subscriptionId",
              in: "path",
              required: true,
              type: "string",
              description: "test subscription id",
            },
            {
              $ref: "#/parameters/ApiVersionParameter",
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
      ApiVersionParameter: {
        name: "api-version",
        in: "query",
        required: true,
        type: "string",
        description: "test api version",
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
