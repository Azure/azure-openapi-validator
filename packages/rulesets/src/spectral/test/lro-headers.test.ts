import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('LroHeaders');
  return linter;
});

test('LroHeaders should find errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
            },
          },
        },
      },
      '/test2': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              headers: {
                location: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results).toHaveLength(2);
    expect(results[0].path.join('.')).toBe('paths./test1.post.responses.202');
    expect(results[1].path.join('.')).toBe('paths./test2.post.responses.202.headers');
    results.forEach((result) => expect(result.message).toBe(
      'A 202 response should include an Operation-Location response header.',
    ));
  });
});

test('LroHeaders should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test1': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              headers: {
                'Operation-location': {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      '/test2': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              headers: {
                'operation-location': {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      '/test3': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              headers: {
                'Operation-Location': {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      '/test4': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              headers: {
                'oPERATION-lOCATION': {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});
