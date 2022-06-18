# PatchContentType

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

A patch operation should consume 'application/merge-patch+json' content type.

## Description

The request body content type for patch operations should be JSON merge patch.

## CreatedAt

June 18, 2022

## LastModifiedAt

June 18, 2022

## How to fix the violation

Change the operation to consume 'application/merge-patch+json' content type.
