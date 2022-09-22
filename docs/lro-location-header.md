# LroLocationHeader

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-V2-ASYNC-7

## Output Message

A 202 response should include an Location response header.

## Description

Location header must be supported for all async operations that return 202.

## CreatedAt

July 07, 2022

## LastModifiedAt

July 07, 2022

## How to fix the violation

Adding the location header schema to the 202 response header schema, like

```
'/test1': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              headers: {
                'Location': {
                  type: 'string',
                },
              },
            },
          },
        },
```
