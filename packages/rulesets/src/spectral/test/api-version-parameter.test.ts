import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('ApiVersionParameterRequired');
  return linter;
});

test('ApiVersionParameterRequired should find errors', () => {
  // Test parameter ordering at path item level and operation level.
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{p1}/foo/{p2}': {
        parameters: [
          {
            name: 'p2',
            in: 'path',
            type: 'string',
          },
          {
            name: 'p1',
            in: 'path',
            type: 'string',
          },
        ],
        get: {
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./test1/{p1}/foo/{p2}.get');
  });
});

test('ApiVersionParameterRequired should find errors', () => {
  // Test parameter ordering at path item level and operation level.
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{p1}/foo/{p2}': {
        parameters: [
          {
            name: 'p2',
            in: 'path',
            type: 'string',
          },
          {
            name: 'p1',
            in: 'path',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'api-version',
              in: 'header',
              type: 'string',
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./test1/{p1}/foo/{p2}.get');
    expect(results[0].message).toBe("Operation 'api-version' parameter should be a query parameter.");
  });
});

test('ApiVersionParameterRequired should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{p1}/foo/{p2}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            type: 'string',
          },
          {
            name: 'api-version',
            in: 'query',
            type: 'string',
          },
        ],
        get: {
          parameters: [
            {
              name: 'p3',
              in: 'query',
              type: 'string',
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('ApiVersionParameterRequired should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1/{p1}/foo/{p2}': {
        parameters: [
          {
            name: 'p1',
            in: 'path',
            type: 'string',
          },
         
        ],
        get: {
          parameters: [
            {
              name: 'p3',
              in: 'query',
              type: 'string',
            },
            {
            name: 'api-version',
            in: 'query',
            type: 'string',
          },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
