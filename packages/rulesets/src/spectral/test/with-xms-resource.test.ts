import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('XmsResourceInPutResponse');
  return linter;
});

test('XmsResourceInPutResponse should find errors for inconsistent resposne', () => {
  const oasDoc = {
    "swagger": "2.0",
    "paths": {
        "/foo": {
             "put": {
                "tags": [ "SampleTag" ],
                "operationId": "Foo_Update",
                "description": "Test Description",
                "parameters": [
                  {
                    "name": "foo_patch",
                    "in": "body",
                    "schema": {
                      "$ref": "#/definitions/FooRequestParams"
                    },
                  }
                ],
                "responses": {
                  "200":{
                    schema: {
                      $ref :"#/definitions/FooResource"
                    }
                  }
                }
            }
        }
    },
    "definitions": {
      "FooRequestParams": {
        "allOf": [
          {
            "$ref": "#/definitions/FooProps"
          }
        ]
      },
      "FooResource": {
        "allOf": [
          {
            "$ref": "#/definitions/FooProps"
          }
        ]
      },
      "FooResourceUpdate": {
        "allOf": [
          {
            "$ref": "#/definitions/FooProps"
          }
        ]
      },
      "FooProps": {
        "properties": {
          "prop0": {
            "type": "string",
            "default": "my def val"
          }
        }
      }
    }
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./foo.put');
    expect(results[0].message).toContain("The 200 response model for an ARM PUT operation must have x-ms-azure-resource extension set to true in its hierarchy.Operation: Foo_Update");
  });
});

test('XmsResourceInPutResponse should find no errors', () => {
  const oasDoc = {
    "swagger": "2.0",
    "paths": {
        "/foo": {
            "patch": {
                "tags": [ "SampleTag" ],
                "operationId": "Foo_Update",
                "description": "Test Description",
                "parameters": [
                  {
                    "name": "foo_patch",
                    "in": "body",
                    "schema": {
                      "$ref": "#/definitions/FooRequestParams"
                    },
                  }
                ],
                "responses": {
                  "200":{
                    schema: {
                      $ref :"#/definitions/FooResource"
                    }
                  }
                }
            },
             "put": {
                "tags": [ "SampleTag" ],
                "operationId": "Foo_Update",
                "description": "Test Description",
                "parameters": [
                  {
                    "name": "foo_patch",
                    "in": "body",
                    "schema": {
                      "$ref": "#/definitions/FooRequestParams"
                    },
                  }
                ],
                "responses": {
                  "200":{
                    schema: {
                      $ref :"#/definitions/FooResource"
                    }
                  }
                }
            }
        }
    },
    "definitions": {
      "FooRequestParams": {
        "allOf": [
          {
            "$ref": "#/definitions/FooProps"
          }
        ]
      },
      "FooResource": {
        "allOf": [
          {
            "$ref": "#/definitions/FooProps"
          }
        ]
      },
      "FooResourceUpdate": {
        "allOf": [
          {
            "$ref": "#/definitions/FooProps"
          }
        ]
      },
      "FooProps": {
        "properties": {
          "prop0": {
            "type": "string",
            "default": "my def val"
          }
        },
        "x-ms-azure-resource":true
      }
    }
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});