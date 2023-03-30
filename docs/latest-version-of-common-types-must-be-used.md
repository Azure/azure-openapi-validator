# LatestVersionOfCommonTypesMustBeUsed

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Output Message

Use the latest version ${commonTypesFilesAndLatestVersionMapping.get(versionAndFile[1])} of ${versionAndFile[1]} available under common-types.

## Description

This rule checks for references that aren't using latest version of common-types.

## How to fix the violation

Ensure that, latest versions of common-types are being referenced.
