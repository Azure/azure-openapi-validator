# LongRunningResponseStatusCode

## Category

SDK Error

## Applies to

ARM and Data plane OpenAPI (swagger) specs

## Related ARM Guideline Code

- RPC-Async-V1-01

## Output Message

A '{0}' operation '{1}' with x-ms-long-running-operation extension must have a valid terminal success status code {2}.

## Description

For **ARM (Control Plane) specs**, valid response status codes for long-running (LRO) operations are as follows:

| Operation Name | Valid Response Codes           |
| -------------- | ------------------------------ |
| Delete         | `200` and `204`                |
| Post           | `200`, `201` ,`202`, and `204` |
| Put            | `200` and `201`                |
| Patch          | `200` and `201`                |

For **Data Plane specs**, valid response status codes for long-running (LRO) operations are as follows:

| Operation Name | Valid Response Codes           |
| -------------- | ------------------------------ |
| Delete         | `200`,`202`, and `204`         |
| Post           | `200`, `201` ,`202`, and `204` |
| Put            | `200`, `201`, and `202`        |
| Patch          | `200`, `201`, and `202`        |

## Why the rule is important

This will ensure that delete, post, put, and patch operations are designed correctly. Please refer [here](https://github.com/Azure/autorest/blob/main/docs/extensions/readme.md#x-ms-long-running-operation) for more details.

## How to fix the violation

Ensure that delete, post, put, and patch operations have valid response codes.
