import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('az-xms-examples-required');
  return linter;
});

test('xml-examples-required should find errors', () => {
const myOpenApiDocument = {
    "swagger": "2.0",
    "paths": {
      "/providers/Microsoft.Storage/operations": {
        "get": {
          "responses": {
            "200": {
              "description": "OK. The request has succeeded."
            }
          }
        },
        "post": {
          "x-ms-examples": {
            "OperationsList": {
              "$ref": "package.json"
            }
          },
          "responses": {
            "200": {
              "description": "OK. The request has succeeded."
            }
          }
        }
      }
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('xml-examples-required should pass check', () => {
  const myOpenApiDocument = {
    "swagger": "2.0",
    "paths": {
      "/providers/Microsoft.Storage/operations": {
        "get": {
          "x-ms-examples": {
            "OperationsList": {
              "$ref": "package.json"
            }
          },
          "responses": {
            "200": {
              "description": "OK. The request has succeeded.",
            }
          }
        },
        "post": {
          "x-ms-examples": {
            "OperationsList": {
              "$ref": "package.json"
            }
          },
          "responses": {
            "200": {
              "description": "OK. The request has succeeded.",
            }
          }
        }
      }
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});