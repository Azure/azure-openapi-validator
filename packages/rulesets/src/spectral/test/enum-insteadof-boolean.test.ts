import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('EnumInsteadOfBoolean');
  return linter;
});

test('EnumInsteadOfBoolean should find errors', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      title: "Boolean properties not recommended in models",
      description: "Some documentation.",
      version: "2017-02-08"
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
        "/foo/{boolparam}": {
          post: {
            operationId: "PostFoo",
            summary: "Foo path",
            description: "Foo operation",
            parameters: [
              {
                in: "body",
                name: "fooPost",
                schema: {
                  type: "boolean",
                  description: "A foo boolean"
                },
                description: "Foo body parameter"
              },
              {
                name: "boolparam",
                in: "path",
                require: true,
                type: "boolean",
                description: "A boolean param defined without schema"
              }
            ],
            responses: {
              default: {
                description: "Unexpected error",
                schema: {
                  type: "boolean",
                  description: "A foo boolean"
                }
              }
            }
          }
        }
      },
    definitions: {
      Test1: {
        description: "Property for foo path 1",
        properties: {
          nameAvailable: {
            readOnly: true,
            type: "boolean",
            description: "Gets a boolean value that indicates whether the name is available for you to use. If true, the name is available. If false, the name has already been taken or invalid and cannot be used."
          },
          anotherProp: {
            readOnly: true,
            type: "boolean",
            description: "Gets a boolean value that indicates whether the name is available for you to use. If true, the name is available. If false, the name has already been taken or invalid and cannot be used."
          }
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
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(5);
    expect(results[0].path.join('.')).toBe('paths./foo/{boolparam}.post.parameters.0.schema');
  });
});

test('DefaultInEnum should find no errors', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      title: "Boolean properties not recommended in models",
      description: "Some documentation.",
      version: "2017-02-08"
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
        "/foo/{boolparam}": {
          post: {
            operationId: "PostFoo",
            summary: "Foo path",
            description: "Foo operation",
            parameters: [
              {
                in: "body",
                name: "fooPost",
                schema: {
                  type: "string",
                  description: "A foo boolean"
                },
                description: "Foo body parameter"
              }
            ],
            responses: {
              default: {
                description: "Unexpected error",
                schema: {
                  type: "string",
                  description: "A foo boolean"
                }
              }
            }
          }
        }
      },
    definitions: {
      Test1: {
        description: "Property for foo path 1",
        properties: {
          anotherProp: {
            readOnly: true,
            type: "string",
            description: "Gets a boolean value that indicates whether the name is available for you to use. If true, the name is available. If false, the name has already been taken or invalid and cannot be used."
          }
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
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});