import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
    linter = await linterForRule('XmsClientNameParameter');
    return linter;
});

test('XmsClientNameParameter should find errors', () => {
    const myOpenApiDocument = {
        "swagger": "2.0",
        "paths": {
            "/providers/Microsoft.Storage/operations": {
                "get": {
                    "responses": {
                        "200": {
                            "description": "OK. The request has succeeded."
                        }
                    },
                    "parameters": [
                        {
                            "name": "search",
                            "in": "query",
                            "type": "string",
                            "description": "test1",
                            "x-ms-client-name": "search"
                        }
                    ]
                }
            }
        }
    };
    return linter.run(myOpenApiDocument).then((results) => {
        expect(results.length).toBe(1);
    });
});

test('XmsClientNameParameter should pass check', () => {
    const myOpenApiDocument = {
        "swagger": "2.0",
        "paths": {
            "/providers/Microsoft.Storage/operations": {
                "get": {
                    "responses": {
                        "200": {
                            "description": "OK. The request has succeeded."
                        }
                    },
                    "parameters": [
                        {
                            "name": "search",
                            "in": "query",
                            "type": "string",
                            "description": "test",
                            "x-ms-client-name": "search2"
                        },
                        {
                            "in": "query",
                            "type": "string",
                            "description": "test",
                            "x-ms-client-name": "search3"
                        },
                        {
                            "name": "search4",
                            "in": "query",
                            "type": "string",
                            "description": "test",
                        },
                    ]
                }
            }
        }
    };
    return linter.run(myOpenApiDocument).then((results) => {
        expect(results.length).toBe(0);
    });
});