# FormData

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

Check for appropriate use of formData parameters.

## Description

It can be appropriate to use formData parameters when sending multiple file-type parameters or an array of file-type parameters.
But it is usually unnecessary and can be overly complicated to use formData when all you are doing is sending a single file-type parameter.
Instead, consider defining a `body` parameter with `type: string, format: binary` and use content-type `application/octet-stream`.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Remove the `formdata` parameter and define a `body` parameter with `type: string, format: binary` and use content-type `application/octet-stream`.
