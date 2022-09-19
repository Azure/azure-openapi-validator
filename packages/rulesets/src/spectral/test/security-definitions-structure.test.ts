import { Spectral } from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("SecurityDefinitionsStructure");
  return linter;
});

test("SecurityDefinitionsStructure should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    securityDefinitions: {
      azure_auth: {
        type: "oauth1",
        flow: "implicit",
        authorizationUrl: "https://login.microsoftonline.com/common/oauth2/authorize",
        description: "Azure_auth description",
        scopes: {
          user_impersonation: "user_impersonation",
        },
      },
    },
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Paths_listPath",
          responses: {
            "200": {
              description: "Success",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(
      "Every OpenAPI(swagger) spec/configuration must have a security definitions section and it must adhere to the following structure: https://github.com/Azure/azure-openapi-validator/blob/main/docs/security-definitions-structure-validation.md"
    );
  });
});

test("SecurityDefinitionsStructure should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    securityDefinitions: {
      azure_auth: {
        type: "oauth2",
        flow: "implicit",
        authorizationUrl: "https://login.microsoftonline.com/common/oauth2/authorize",
        description: "Azure_auth description",
        scopes: {
          user_impersonation: "user_impersonation",
        },
      },
    },
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Paths_listPath",
          responses: {
            "200": {
              description: "Success",
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
