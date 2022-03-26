import linterForRule from './utils';

import { Spectral } from '@stoplight/spectral-core';
let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('az-default-in-enum');
  return linter;
});

test('az-default-in-enum should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      definitions: {
        Test0: {
          description: "Property for foo path 2"
        },
        Test: {
          type: "string",
          description: "Property for foo path",
          enum: [
            "Foo",
            "Bar"
          ],
          default: "Baz"
        }
      }
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths.definitions.Test');
  });
});

test('az-default-in-enum should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      definitions: {
        Test0: {
          description: "Property for foo path 2",
          enum: [
            "Foo",
            "Bar"
          ],
        },
        Test: {
          type: "string",
          description: "Property for foo path",
          enum: [
            "Foo",
            "Bar"
          ],
          default: "Baz"
        }
      }
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths.definitions.Test0');
  });
});

test('az-default-in-enum should find no errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      definitions: {
        Test0: {
          description: "Property for foo path 2"
        },
        Test: {
          type: "string",
          description: "Property for foo path",
          enum: [
            "Foo",
            "Bar"
          ],
          default: "Bar"
        }
      }
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});