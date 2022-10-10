import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('VersionConvention');
  return linter;
});

test('VersionConvention should find errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    info: {
      version: '3.0.1',
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('info.version');
  });
});

test('VersionConvention should find no errors', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    info: {
      version: '2021-07-01',
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('VersionConvention allows -preview suffix', () => {
  const myOpenApiDocument = {
    swagger: '2.0',
    info: {
      version: '2021-07-01-preview',
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
