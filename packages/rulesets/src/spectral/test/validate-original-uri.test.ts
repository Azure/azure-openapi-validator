import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('LROFinalStateOriginalUri');
  return linter;
});

test('LROFinalStateOriginalUri should find errors for final-stat-via:original-uri', () => {
  const oasDoc = {
    "swagger": "2.0",
    "paths": {
        "/foo": {
            "put": {
                "tags": [ "SampleTag" ],
                "operationId": "Foo_CreateOrUpdate",
                "description": "Test Description",
                "parameters": [
                ],
                "responses": {
                },
                "x-ms-long-running-operation": true,
                "x-ms-long-running-operation-options" : {
                  "final-state-via" : "original-uri"
                }
            }
        }
    }
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./foo.put');
    expect(results[0].message).toContain('The long running operation with final-state-via:original-uri has slibing \'get\' operation.');
  });
});

test('LROFinalStateOriginalUri should find no errors', () => {
  const oasDoc = {
    "swagger": "2.0",
    "paths": {
        "/foo": {
            "put": {
                "tags": [ "SampleTag" ],
                "operationId": "Foo_CreateOrUpdate",
                "description": "Test Description",
                "parameters": [
                ],
                "responses": {
                },
                "x-ms-long-running-operation": true,
                "x-ms-long-running-operation-options" : {
                  "final-state-via" : "original-uri"
                }
            },
            "get": {
                "tags": [ "SampleTag" ],
                "operationId": "Foo_Get",
                "description": "Test Description",
                "parameters": [
                ],
                "responses": {
                }
            }
        }
    }
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});