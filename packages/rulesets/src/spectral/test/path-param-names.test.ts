import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('PathParameterNames');
  return linter;
});

test('PathParameterNames should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/foo/{p1}': {},
      '/foo/{p2}/bar/{p3}': {},
      '/bar/{p4}': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./foo/{p2}/bar/{p3}');
    expect(results[0].message).toContain('Inconsistent path parameter names "p2" and "p1"');
    expect(results[1].path.join('.')).toBe('paths./bar/{p4}');
    expect(results[1].message).toContain('Inconsistent path parameter names "p4" and "p3"');
  });
});

test('PathParameterNames should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/foo/{p1}': {},
      '/foo/{p1}/bar/{p2}': {},
      '/bar/{p2}': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('PathParameterNames should find oas3 errors', () => {
  const oasDoc = {
    openapi: '3.0',
    paths: {
      '/foo/{p1}': {},
      '/foo/{p2}/bar/{p3}': {},
      '/bar/{p4}': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./foo/{p2}/bar/{p3}');
    expect(results[0].message).toContain('Inconsistent path parameter names "p2" and "p1"');
    expect(results[1].path.join('.')).toBe('paths./bar/{p4}');
    expect(results[1].message).toContain('Inconsistent path parameter names "p4" and "p3"');
  });
});

test('PathParameterNames should find no oas3 errors', () => {
  const oasDoc = {
    openapi: '3.0',
    paths: {
      '/foo/{p1}': {},
      '/foo/{p1}/bar/{p2}': {},
      '/bar/{p2}': {},
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
