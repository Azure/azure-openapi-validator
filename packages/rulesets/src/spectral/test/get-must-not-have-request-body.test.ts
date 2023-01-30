import {Spectral} from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("GetMustNotHaveRequestBody");
  return linter;
});

test("GetMustNotHaveRequestBody should find errors when body is specified with a get", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Noun_Get",
          parameters: [
            {
              name: 'body',
              in: 'body',
              type: 'string',
              required: true,
            },
          ],
          responses: {
            default: {
              description: "Unexpected error",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.get.parameters.0");
  });
});

test("GetMustNotHaveRequestBody should find no errors when body is not specified with a get", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Noun_Get",
          responses: {
            default: {
              description: "Unexpected error",
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
