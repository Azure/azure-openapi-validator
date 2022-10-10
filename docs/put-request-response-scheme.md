# PutRequestResponseScheme

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

A PUT operation request body schema should be the same as its 200 response schema, to allow reusing the same entity between GET and PUT. If the schema of the PUT request body is a superset of the GET response body, make sure you have a PATCH operation to make the resource updatable. Operation: '{0}' Request Model: '{1}' Response Model: '{2}'

## Description

The request & response('200') schema of the PUT operation must be same.

## Why the rule is important

This will provide a consistent experience to the user, i.e. the user could use the same model object to perform various operations. Also, within the SDK, this will encourage reuse of the same model objects.

## How to fix the violation

Ensure the request & response('200') schema of the PUT operation must be same. This might involve a service side change which will result cause a breaking change in the generated SDK.
