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
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('parameters.test');
  });
});
