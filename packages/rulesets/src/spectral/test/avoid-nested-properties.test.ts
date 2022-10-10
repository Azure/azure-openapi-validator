import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
    linter = await linterForRule('AvoidNestedProperties');
    return linter;
});

test('AvoidNestedProperties should find errors', () => {
    const myOpenApiDocument = {
        swagger: "2.0",
        info: {
            description: "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
        },
        definitions:{
            externalDocs: {
                properties:{
                    properties:{
                        $ref: "#/definitions/BackendProperties"
                    }
                },
            },
            BackendProperties: {
                properties:{
                    $ref: "#/definitions/externalDocs"
                },
            }
        }
    };
    return linter.run(myOpenApiDocument).then((results) => {
        expect(results.length).toBe(1);
    });
});

test('AvoidNestedProperties should find no errors', () => {
    const myOpenApiDocument = {
        swagger: "2.0",
        info: {
            description: "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
        },
        definitions:{
            externalDocs: {
                properties:{
                    properties:{
                        "x-ms-client-flatten" : true,
                        $ref: "#/definitions/BackendProperties"
                    }
                },
            },
            BackendProperties: {
                properties:{
                    $ref: "#/definitions/externalDocs"
                },
            }
        }
    };
    return linter.run(myOpenApiDocument).then((results) => {
        expect(results.length).toBe(0);
    });
});

