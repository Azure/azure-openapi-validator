import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('RequestSchemaForTrackedResourcesMustHaveTags');
  return linter;
});

test('RequestSchemaForTrackedResourcesMustHaveTags should find errors for tracked resources without tags', () => {
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
                      $ref :"#/definitions/FooResourceUpdate"
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
          "location": {
            "type": "string",
          }
        }
      }
    }
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toContain('put');
    expect(results[0].message).toContain("Tracked resource does not have tags in the request schema.");
  });
});

test('RequestSchemaForTrackedResourcesMustHaveTags should find errors for tracked resources with tags specified as required property', () => {
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
                      $ref :"#/definitions/FooResourceUpdate"
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
          "location": {
            "type": "string",
          },
          "tags": {
            "type": "object",
            "additionalProperties": {
            "type": "string"
            },
          }
        },
        "required": [
          "tags"
        ],
      }
    }
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toContain('put');
    expect(results[0].message).toContain("Tags must not be a required property.");
  });
});

test('RequestSchemaForTrackedResourcesMustHaveTags should not find errors for tracked resources with tags', () => {
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
                      $ref :"#/definitions/FooResourceUpdate"
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
          "location": {
            "type": "string",
          },
          "tags": {
            "type": "object",
            "additionalProperties": {
            "type": "string"
            },
          }
        }
      }
    }
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});