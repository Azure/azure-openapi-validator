# ConsistentResponseBody

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

Ensure the get, put, and patch response body schemas are consistent.

## Description

The standard pattern for REST operations is that a create (PUT), read (GET), and update (PATCH) all return
a representation of the resource.

For a path with a "create" operation (put or patch that returns 201), the 200 response of get, put, and patch, if present,
should have the same response body schema as the create operation 201 response.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Use a consistent schema for the response of get, put, and patch if present.
