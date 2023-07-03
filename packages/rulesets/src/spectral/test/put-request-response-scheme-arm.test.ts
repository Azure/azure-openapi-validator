import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("PutRequestResponseSchemeArm")
  return linter
})

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
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toBe(
      "A PUT operation request body schema should be the same as its 200 response schema, to allow reusing the same entity between GET and PUT. If the schema of the PUT request body is a superset of the GET response body, make sure you have a PATCH operation to make the resource updatable. Operation: 'ConfigServers_Update' Request Model: 'parameters[2].schema' Response Model: 'responses[200].schema'"
    )
    expect(results[0].path.join(".")).toBe("paths./api/configServers.put")
  })
})

test("PutRequestResponseScheme should find errors when response code 200 is not defined", () => {
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
            "201": {
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
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toBe(
      "A PUT operation request body schema should be the same as its 200 response schema, to allow reusing the same entity between GET and PUT. If the schema of the PUT request body is a superset of the GET response body, make sure you have a PATCH operation to make the resource updatable. Operation: 'ConfigServers_Update' Request Model: 'parameters[2].schema' Response Model: 'responses[201].schema'"
    )
    expect(results[0].path.join(".")).toBe("paths./api/configServers.put")
  })
})

test("PutRequestResponseScheme should find no errors", () => {
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
          $ref: "#/definitions/ConfigServerResource",
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("PutRequestResponseScheme for json property with empty value in swagger should find no errors. JobAgent.x-ms-arm-id-details is empty below", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/configServers": {
        put: {
          tags: ["JobAgents"],
          description: "Creates or updates a job agent.",
          operationId: "JobAgents_CreateOrUpdate",
          parameters: [
            {
              name: "parameters",
              in: "body",
              description: "The requested job agent resource state.",
              required: true,
              schema: {
                $ref: "#/definitions/JobAgent",
              },
            },
          ],
          responses: {
            "200": {
              description: "Successfully updated the job agent.",
              schema: {
                $ref: "#/definitions/JobAgent",
              },
            },
            default: {
              description:
                "*** Error Responses: ***\n\n * 400 ManagedInstanceStoppingOrStopped - Conflicting operation submitted while instance is in stopping/stopped state\n\n * 400 ManagedInstanceStarting - Conflicting operation submitted while instance is in starting state\n\n * 400 InvalidResourceRequestBody - The resource or resource properties in the request body is empty or invalid.\n\n * 400 MissingSkuName - Sku name is required.\n\n * 400 InvalidDatabaseResourceId - Invalid database resource identifier.\n\n * 400 InvalidResourceIdentityTenantId - \n\n * 400 MismatchingSubscriptionWithUrl - The provided subscription did not match the subscription in the Url.\n\n * 400 MismatchingResourceGroupNameWithUrl - The provided resource group name did not match the name in the Url.\n\n * 400 MismatchingServerNameWithUrl - The provided server name did not match the name in the Url.\n\n * 400 MissingUserAssignedIdentities - \n\n * 400 MissingIdentityType - \n\n * 400 MultipleIdentitiesOnJobAgent - \n\n * 400 InvalidIdentityType - \n\n * 400 JobAgentDatabaseEditionUnsupported - The specified database's service level objective is not supported for use as a job agent database.\n\n * 400 JobAgentDatabaseSecondary - A job agent cannot be linked to a geo-secondary database.\n\n * 400 JobAgentDatabaseAlreadyLinked - The specified database is already linked to another job agent.\n\n * 400 DatabaseDoesNotExist - The requested database was not found\n\n * 400 CannotUseReservedDatabaseName - Cannot use reserved database name in this operation.\n\n * 400 ElasticJobsNotSupportedOnAutoPauseEnabledDatabase - Serverless database with auto-pause is not supported by Elastic jobs because job agent would stop database from pausing. Please disable auto-pause on your serverless database and retry Elastic Job agent creation. See here for more details: https://docs.microsoft.com/azure/azure-sql/database/serverless-tier-overview#auto-pausing\n\n * 400 JobAgentExceededQuota - Could not create job agent because it would exceed the quota.\n\n * 400 JobAgentAlreadyExists - The job agent already exists on the server.\n\n * 404 SubscriptionDoesNotHaveServer - The requested server was not found\n\n * 404 ServerNotInSubscriptionResourceGroup - Specified server does not exist in the specified resource group and subscription.\n\n * 404 PropertyChangeUnsupported - Property cannot be modified.\n\n * 404 SubscriptionNotFound - The requested subscription was not found.\n\n * 409 ServerDisabled - Server is disabled.",
            },
            "202": {
              description: "Accepted",
            },
            "201": {
              description: "Successfully created the job agent.",
              schema: {
                $ref: "#/definitions/JobAgent",
              },
            },
          },
          "x-ms-long-running-operation": true,
        },
      },
    },
    definitions: {
      Sku: {
        description: "The resource model definition representing SKU",
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the SKU. E.g. P3. It is typically a letter+number code",
          },
        },
        required: ["name"],
      },
      JobAgent: {
        "x-ms-arm-id-details": {},
        description: "An Azure SQL job agent.",
        type: "object",
        properties: {
          sku: {
            $ref: "#/definitions/Sku",
            description: "The name and tier of the SKU.",
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
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
