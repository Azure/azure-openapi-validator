import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('DefaultInEnum');
  return linter;
});

test('DefaultInEnum should find 1 error', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      title: "Default value for an ObjectSchema does not appear in enum constraint",
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
    paths: {
      "/foo": {
        post: {
          operationId: "PostFoo",
          summary: "Foo path",
          description: "Foo operation",
          responses: {
            default: {
              description: "Unexpected error"
            }
          }
        }
      }
    },
    definitions: {
      Test1: {
        description: "Property for foo path 1"
      },
      Test2: {
        description: "Property for foo path 2"
      },
      Test: {
        type: "string",
        description: "Property for foo path",
        enum: [
          "Foo",
          "Bar"
        ],
        default: "Baz"
      }
    },
    parameters: {
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
    expect(results[0].path.join('.')).toBe('definitions.Test');
  });
});

test('DefaultInEnum should find no errors', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      title: "Default value for an ObjectSchema does not appear in enum constraint",
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
    paths: {
      "/foo": {
        post: {
          operationId: "PostFoo",
          summary: "Foo path",
          description: "Foo operation",
          responses: {
            default: {
              description: "Unexpected error"
            }
          }
        }
      }
    },
    definitions: {
      Test1: {
        description: "Property for foo path 1"
      },
      Test2: {
        description: "Property for foo path 2",
        enum: "a property"
      },
      Test: {
        type: "string",
        description: "Property for foo path",
        enum: [
          "Foo",
          "Bar"
        ],
        default: "Bar"
      }
    },
    parameters: {
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
    expect(results.length).toBe(0);
  });
});