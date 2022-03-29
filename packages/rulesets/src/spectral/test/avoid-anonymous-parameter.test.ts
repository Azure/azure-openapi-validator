import linterForRule from './utils';

import { Spectral } from '@stoplight/spectral-core';
let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('az-avoid-anonymous-parameter');
  return linter;
});

test('az-avoid-anonymous-parameter should find errors', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      title: "Consumes has an unsupported MIME type",
      description: "Some documentation.",
      version: "2014-04-01-preview"
    },
    host: "management.azure.com",
    schemes: [
      "https"
    ],
    basePath: "/",
    produces: [
      "application/json"
    ],
    paths: {
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/dnsZones/{zoneName}/{recordType}/{relativeRecordSetName}": {
      patch: {
        tags: [
          "RecordSets"
        ],
        operationId: "RecordSets_Update",
        description: "Updates a record set within a DNS zone.",
        parameters: [
          {
            name: "zoneName",
            in: "path",
            required: true,
            type: "string",
            schema: {
              type: "string",
              description: "error",
              properties: {
                prop1: {
                  type: "string",
                  description: "property 1"
                }
              }
            },
            description: "The name of the DNS zone (without a terminating dot)."
          },
          {
            name: "parameters",
            in: "body",
            required: true,
            schema: {
              "$ref": "#/parameters/test"
            },
            description: "Parameters supplied to the Update operation."
          }
        ]
      }
    }
    },
    consumes: [
      "application/json"
    ],
    parameters: {
      test: {
        name: "PetCreateOrUpdateParameter",
        description: "test",
        in: "body",
        schema: {
          type: "string",
          description: "error",
          properties: {
            prop1: {
              type: "string",
              description: "property 1"
            }
          }
        }
      },
      SubscriptionIdParameter: {
        name: "subscriptionId",
        in: "path",
        required: true,
        type: "string",
        description: "test subscription id"
      },
      ApiVersion: {
        name: "api-version",
        in: "path",
        required: true,
        type: "string",
        description: "test api version"
      }
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('az-avoid-anonymous-parameter should find no errors', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      title: "Consumes has an unsupported MIME type",
      description: "Some documentation.",
      version: "2014-04-01-preview"
    },
    host: "management.azure.com",
    schemes: [
      "https"
    ],
    basePath: "/",
    produces: [
      "application/json"
    ],
    consumes: [
      "application/json"
    ],
    parameters: {
      test: {
        name: "PetCreateOrUpdateParameter",
        description: "test",
        in: "body",
        schema: {
          "$ref": "#/definitions/FooRequestParams"
        }
      }
    },
    definitions: {
      FooRequestParams: {
        properties: {
          prop0: {
            type: "string"
          }
        },
        required: []
      }
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

