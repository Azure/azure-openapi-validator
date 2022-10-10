import { Spectral } from '@stoplight/spectral-core';
import linterForRule from './utils';

let linter:Spectral;

beforeAll(async () => {
  linter = await linterForRule('CollectionObjectPropertiesNaming');
  return linter;
});


test('CollectionObjectPropertiesNaming should find errors in value property', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/test2': {
        get: {
          operationId: "test_ListByID",
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'string',
                  },
                  nextLink: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextLink',
          },
        },
      },
      '/test3': {
        get: {
          operationId: "test_ListByID",
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  values: {
                    type: 'array',
                  },
                  nextLink: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextLink',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results[0].path.join('.')).toBe('paths./test2.get.responses.200.schema');
    expect(results[0].message).toBe("Collection object returned by list operation 'test_ListByID' with 'x-ms-pageable' extension, has no property named 'value'.");
    expect(results[1].path.join('.')).toBe('paths./test3.get.responses.200.schema');
    expect(results[1].message).toBe("Collection object returned by list operation 'test_ListByID' with 'x-ms-pageable' extension, has no property named 'value'.");
  });
});


test('CollectionObjectPropertiesNaming should find no errors', () => {
  const oasDoc = {
    swagger: '2.0',
    paths: {
      '/good-path': {
        get: {
          operationId: 'Good_List',
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  nextLink: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextLink',
          },
        },
      },
      '/good-path2': {
        get: {
          operationId: 'Good_List2',
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  nextLink: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: null,
          },
        },
      },
      '/good-path3': {
        get: {
          operationId: 'Good_List3',
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  nextPage: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
            },
          },
          'x-ms-pageable': {
            nextLinkName: 'nextPage',
          },
        },
      },
      '/good-path4': {
        get: {
          operationId: 'Good_NotList',
          responses: {
            200: {
              description: 'Success',
              schema: {
                properties: {
                  value: {
                    type: 'array',
                  },
                  this: {
                    type: 'string',
                  },
                  that: {
                    type: 'string',
                  },
                  theOther: {
                    type: 'string',
                  },
                },
                required: ['value'],
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
