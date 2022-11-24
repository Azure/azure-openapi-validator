import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('DefinitionsPropertiesNamesCamelCase');
  return linter;
});

test('DefinitionsPropertiesNamesCamelCase should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
    },
    definitions: {
      TestModelA:{
        type:"object",
        properties: {
          validCamelCAS:{
            type: "string"
          },
          validCamelCAseABC:{
            type: "string"
          },
          InvalidCamelCase: {
            type: "string"
          },
          invalidCAMElCase: {
            type: "string"
          }
        }
      }
    }
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('definitions.TestModelA.properties.InvalidCamelCase');
    expect(results[0].message).toBe('Property name should be camel case.');
    expect(results[1].path.join('.')).toBe('definitions.TestModelA.properties.invalidCAMElCase');
    expect(results[1].message).toBe('Property name should be camel case.');
  });
});

test('DefinitionsPropertiesNamesCamelCase should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
    },
    definitions: {
      TestModelA:{
        type:"object",
        properties: {
          validCamelCAS:{
            type: "string"
          },
          validCamelCAseABC:{
            type: "string"
          }
        }
      }
    }
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
