import { Spectral } from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("PutRequestResponseScheme");
  return linter;
});

test("PutRequestResponseScheme should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/configServers": {
        put: {
          operationId: "ConfigServers_Update",
          parameters: [
            {
              $ref: "#/parameters/ApiVersionParameter",
            },
            {
              $ref: "#/parameters/SubscriptionIdParameter",
            },
            {
              $ref: "#/parameters/PathResourceParameter",
            },
          ],
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/ConfigServerResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      ConfigServerResource: {
        description: "Config Server resource",
        type: "object",
        properties: {
          provisioningState: {
            description: "State of the config server.",
            enum: ["NotAvailable", "Deleted", "Failed", "Succeeded", "Updating"],
            type: "string",
            readOnly: true,
            "x-ms-enum": {
              name: "ConfigServerState",
              modelAsString: true,
            },
          },
        },
      },
      ConfigServerResources: {
        description: "Config Server resources",
        type: "object",
        properties: {
          provisioningStates: {
            description: "State of the config server.",
            enum: ["NotAvailable", "Deleted", "Failed", "Succeeded", "Updating"],
            type: "string",
            readOnly: true,
            "x-ms-enum": {
              name: "ConfigServerState",
              modelAsString: true,
            },
          },
        },
      },
    },
    parameters: {
      ApiVersionParameter: {
        name: "api-version",
        in: "query",
        description: "The API version to use for this operation.",
        required: true,
        type: "string",
        minLength: 1,
      },
      SubscriptionIdParameter: {
        name: "subscriptionId",
        in: "path",
        description:
            "Gets subscription ID which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.",
        required: true,
        type: "string",
      },
      PathResourceParameter: {
        name: "pathResource",
        in: "body",
        description: "Parameters for the update operation",
        required: true,
        schema: {
          $ref: "#/definitions/ConfigServerResources",
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].message).toBe(
        "A PUT operation request body schema should be the same as its 200 response schema, to allow reusing the same entity between GET and PUT. If the schema of the PUT request body is a superset of the GET response body, make sure you have a PATCH operation to make the resource updatable. Operation: 'ConfigServers_Update' Request Model: 'ConfigServerResources' Response Model: 'ConfigServerResource'"
    );
    expect(results[0].path.join(".")).toBe("paths./api/configServers.put");
  });
});