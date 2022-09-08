import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('LocationMustHaveXmsMutability');
  return linter;
});

test('LocationMustHaveXmsMutability should find errors', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      title: "Consumes has an unsupported MIME type",
      description: "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
      version: "2014-04-01-preview"
    },
    definitions:{
      AuthorizationServerCollection:{
        properties: {
          location: {
            type: "string",
            description: "Resource location",
            "x-ms-mutability": [
              "read"
            ]
          },
        }
      },
      ManagedResource:{
        properties: {
          location: {
            type: "string",
            description: "Resource location",
            "x-ms-mutability": [
              "create"
            ]
          },
        }
      },
      Resource:{
        properties: {
          location: {
            type: "string",
            description: "Resource location"
          },
        }
      }
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(3);
  });
});

test('LocationMustHaveXmsMutability should find no errors', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      title: "Consumes has an unsupported MIME type",
      description: "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
      version: "2014-04-01-preview"
    },
    definitions:{
      AuthorizationServerCollection:{
        properties: {
          location: {
            type: "string",
            description: "Resource location",
            "x-ms-mutability": [
              "read",
              "create"
            ]
          },
        }
      }
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

