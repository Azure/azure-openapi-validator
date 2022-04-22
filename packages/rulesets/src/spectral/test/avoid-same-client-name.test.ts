import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('az-avoid-same-client-name');
  return linter;
});

test('avoid-same-model-client-name should find errors', () => {
  const myOpenApiDocument = {
    "swagger": "2.0",
    "paths": {
      "/providers/Microsoft.Storage/operations": {
        "get": {
        "parameters": [{
            "name": "testname1",
            "x-ms-client-name": "testname1"
          },
          {
            "x-ms-client-name": "testname2"
          },
          {
            "name": "testname3"
          }],
          "responses": {
            "200": {
              "description": "OK. The request has succeeded."
            }
          }
        }
      }
    },
    "definitions": {
    "OperationListResult": {
      "description": "Result of the request to list Storage operations. It contains a list of operations and a URL link to get the next set of results.",
       "properties": {
         "testname1": {
           "x-ms-client-name" : "testname1"
          },
          "testname2": {
          }
        }
      }
   }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('avoid-same-client-name should pass check', () => {
  const myOpenApiDocument = {
    "swagger": "2.0",
    "paths": {
      "/providers/Microsoft.Storage/operations": {
        "get": {
        "parameters": [{
            "name": "testname1"
          },
          {
             "x-ms-client-name": "testname2"
          },
          {
            "name" : "testname3",
            "x-ms-client-name": "testname4"
          }],
          "responses": {
            "200": {
              "description": "OK. The request has succeeded."
            }
          }
        }
      }
    },
    "definitions": {
    "OperationListResult": {
      "description": "Result of the request to list Storage operations. It contains a list of operations and a URL link to get the next set of results.",
       "properties": {
          "testname3": {
            "x-ms-client-name" : "testname4"
          }
        }
      }
   }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});