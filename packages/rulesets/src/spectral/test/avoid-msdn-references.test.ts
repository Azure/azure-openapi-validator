import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('AvoidMsdnReferences');
  return linter;
});

test('AvoidMsdnReferences should find errors', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      title: "Consumes has an unsupported MIME type",
      description: "Use these APIs to manage Azure Websites resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://msdn.microsoft.com/en-us/library/azure/dn790557.aspx.",
      version: "2014-04-01-preview"
    },
    definitions:{
      AuthorizationServerCollection:{
        definitions:{
          AuthorizationServerCollection:{
            externalDocs: {
              url: "https://msdn.microsoft.com"
            },
            grantTypes:{
              externalDocs:{
                url: "https://docs.microsoft.com/msdn.microsoft.com"
              }
            }
          }
        }
      }
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('AvoidMsdnReferences should find no errors', () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    info: {
      title: "Consumes has an unsupported MIME type",
      description: "Use these REST APIs for performing operations on Backend entity in Azure API Management deployment. The Backend entity in API Management represents a backend service that is configured to skip certification chain validation when using a self-signed certificate to test mutual certificate authentication.",
      version: "2014-04-01-preview"
    },
    definitions:{
      AuthorizationServerCollection:{
        externalDocs: {
          url: "https://learn.microsoft.com"
        },
        grantTypes:{
          externalDocs:{
            url: "https://learn.microsoft.com"
          }
        }
      }
    }
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

