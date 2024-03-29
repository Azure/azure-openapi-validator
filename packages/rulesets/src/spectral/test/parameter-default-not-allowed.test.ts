import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('ParameterDefaultNotAllowed');
  return linter;
});

test('ParameterDefaultNotAllowed should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/path1': {
        parameters: [
          {
            name: 'param1',
            in: 'query',
            type: 'string',
            required: true,
            default: 'param1',
          },
        ],
        get: {
          parameters: [
            {
              name: 'param2',
              in: 'query',
              type: 'string',
              required: true,
              default: 'param2',
            },
          ],
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./path1.parameters.0.default');
    expect(results[1].path.join('.')).toBe('paths./path1.get.parameters.0.default');
  });
});

test('ParameterDefaultNotAllowed should find no errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    paths: {
      '/path1': {
        parameters: [
          {
            name: 'param1',
            in: 'query',
            type: 'string',
            required: false,
            default: 'param1',
          },
        ],
        get: {
          parameters: [
            {
              name: 'param2',
              in: 'query',
              type: 'string',
              default: 'param2',
            },
          ],
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
