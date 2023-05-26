# SchemaTypeAndFormat

## Category

Data Plane Warning

## Applies to

Data Plane OpenAPI specs

## Output Message

Schema with type: {{type}} has unrecognized format: {{format}}

## Description

Every schema should specify a well-defined combination of `type` and `format`.

`format` is required for type integer and number, optional for type string,
and not allowed for any other types.

The well-defined type/format combinations are:

**type: integer**

| format   | description     | comments                  |
| -------- | --------------- | ------------------------- |
| int32    | signed 32 bits  | from [oas2][oas2]         |
| int64    | signed 64 bits  | from [oas2][oas2]         |
| unixtime | Unix time stamp | from [AutoRest][autorest] |

**type: number**

| format  | description            | comments                  |
| ------- | ---------------------- | ------------------------- |
| float   | 32 bit floating point  | from [oas2][oas2]         |
| int64   | 64 bit floating point  | from [oas2][oas2]         |
| decimal | 128 bit floating point | from [AutoRest][autorest] |

**type: string**

| format            | description                  | comments                  |
| ----------------- | ---------------------------- | ------------------------- |
| byte              | base64 encoded characters    | from [oas2][oas2]         |
| binary            | any sequence of octets       | from [oas2][oas2]         |
| date              | [RFC3339][rfc3339] full-date | from [oas2][oas2]         |
| date-time         | [RFC3339][rfc3339] date-time | from [oas2][oas2]         |
| password          | sensitive value              | from [oas2][oas2]         |
| char              |                              | from [AutoRest][autorest] |
| time              |                              | from [AutoRest][autorest] |
| date-time-rfc1123 |                              | from [AutoRest][autorest] |
| date-time-rfc7231 |                              | from [AutoRest][autorest] |
| duration          |                              | from [AutoRest][autorest] |
| uuid              |                              | from [AutoRest][autorest] |
| base64url         |                              | from [AutoRest][autorest] |
| url               |                              | from [AutoRest][autorest] |
| odata-query       |                              | from [AutoRest][autorest] |
| certificate       |                              | from [AutoRest][autorest] |

[oas2]: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#data-types
[autorest]: https://github.com/Azure/autorest/blob/main/packages/libs/openapi/src/v3/formats.ts
[rfc3339]: https://xml2rfc.tools.ietf.org/public/rfc/

## CreatedAt

July 21, 2022

## LastModifiedAt

July 21, 2022

## How to fix the violation

Change the schema to use a well-defined type and format.
