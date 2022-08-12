import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('PathResourceProviderMatchNamespace');
  return linter;
});

test('PathResourceProviderMatchNamespace should find errors', () => {
  const oasDocPath = "resources/Microsoft.Contoso/inconsistent-provider-namespace.json"
  return linter.run(oasDocPath).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe('paths./foo/{p2}/bar/{p3}');
    expect(results[0].message).toContain('Inconsistent path parameter names "p2" and "p1"');
    expect(results[1].path.join('.')).toBe('paths./bar/{p4}');
    expect(results[1].message).toContain('Inconsistent path parameter names "p4" and "p3"');
  });
});

test('PathResourceProviderMatchNamespace should find no errors', () => {
  const oasDocPath = "resources/Microsoft.Contoso/provider-namespace.json"
  return linter.run(oasDocPath).then((results) => {
    expect(results.length).toBe(0);
  });
});
