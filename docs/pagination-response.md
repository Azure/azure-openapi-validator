# PaginationResponse

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

One of:

- top parameter must be type: integer
- top parameter must be optional
- top parameter must have no default value
- skip parameter must be type: integer
- skip parameter must be optional
- maxpagesize parameter must be named "maxpagesize" (all lowercase)
- maxpagesize parameter must be type: integer
- maxpagesize parameter must be optional
- maxpagesize parameter must have no default value
- orderby parameter must be named "orderby" (all lowercase)

## Description

Pagination parameters must conform to Azure guidelines.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Correct the definition of the pagination parameter.
