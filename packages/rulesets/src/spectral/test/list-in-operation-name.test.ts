import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('ListInOperationName');
  return linter;
});

test('ListInOperationName should find invalid operationId', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    schemes: [
      "https"
    ],
    info: {
      title: "Consumes has an unsupported MIME type",
      description: "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
      version: "2014-04-01-preview"
    },
    paths:{
      "/some/test/path":{
        get:{
          operationId:"Extensions_Get",
          "x-ms-pageable": {
            nextLinkName: "nextLink"
          },
        }
      },
      "/some/test/path2":{
        post:{
          operationId:"_List",
          "x-ms-pageable": {
            nextLinkName: "nextLink"
          },
        },
      },
      "/some/test/path3":{
        delete:{
          operationId:"ExtensionsList",
          "x-ms-pageable": {
            nextLinkName: "nextLink"
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(3);
  });
});

test('ListInOperationName should find invalid operation id which response contains array.', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    schemes: [
      "http",
      "https"
    ],
    info: {
      title: "Consumes has an unsupported MIME type",
      description: "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
      version: "2014-04-01-preview"
    },
    paths:{
      "/some/test/path":{
        post:{
          operationId:"Extensions_Update",
          "x-ms-pageable": {
            nextLinkName: "nextLink"
          },
          responses:{
            "200":{
              "schema": {
                "$ref": "#/definitions/BastionSessionDeleteResult"
              }
            },
            "default": {
              description: "The detailed error response.",
              schema: {
                "$ref": "#/definitions/BastionSessionDeleteResult"
              }
            }
          }
        }
      }
    },
    definitions:{
      BastionSessionDeleteResult:{
        properties:{
          value:{
            type: "array"
          }
        }
      }
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
  });
});

test('ListInOperationName should pass check', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    schemes: [
      "https"
    ],
    info: {
      title: "Consumes has an unsupported MIME type",
      description: "Use these REST APIs for performing operations on Backend entity in Azure API Management deployment. The Backend entity in API Management represents a backend service that is configured to skip certification chain validation when using a self-signed certificate to test mutual certificate authentication.",
      version: "2014-04-01-preview"
    },
    paths: {
      "/instance": {
        "get": {
          operationId: "Instances_GetMetadata",
        }
      },
      "/some/test/path1":{
        get:{
          operationId:"List",
          "x-ms-pageable": {
            nextLinkName: "nextLink"
          },
        },
      },
      "/some/test/path2":{
        get:{
          operationId:"Extension_List",
          "x-ms-pageable": {
            nextLinkName: "nextLink"
          },
        },
      },
      "/some/test/path3":{
        post:{
          operationId:"Extension_ListByTest",
          responses:{
            "200":{
              "schema": {
                "$ref": "#/definitions/BastionSessionDeleteResult"
              }
            },
            "default": {
              description: "The detailed error response.",
              schema: {
                "$ref": "#/definitions/BastionSessionDeleteResult"
              }
            }
          }
        },
      },
    },
    definitions:{
      BastionSessionDeleteResult:{
        properties:{
          value:{
            type: "array"
          }
        }
      }
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

