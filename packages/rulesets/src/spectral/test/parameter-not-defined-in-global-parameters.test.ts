import {Spectral} from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("ParameterNotDefinedInGlobalParameters");
  return linter;
});

test("ParameterNotDefinedInGlobalParameters should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Path_Get",
          parameters: [
            {
              name: "subscriptionId",
              in: "path",
              required: true,
              type: "string",
              description: "test subscription id",
            },
            {
              name: "api-version",
              in: "path",
              required: true,
              type: "string",
              description: "test api version",
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
      ServiceNameParameter: {
        name: "serviceName",
        in: "path",
        description: "The name of the Service resource.",
        required: true,
        type: "string",
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.get.parameters");
  });
});

test("ParameterNotDefinedInGlobalParameters should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Path_Get",
          parameters: [
            {
              $ref: "#/parameters/SubscriptionIdParameter"
            },
            {
              $ref: "#/parameters/ApiVersionParameter"
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
      SubscriptionIdParameter: {
        name: "subscriptionId",
        in: "path",
        required: true,
        type: "string",
        description: "test subscription id",
      },
      ApiVersionParameter: {
        name: "api-version",
        in: "path",
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
