# XMSSecretInResponse

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-13

## Description

When defining the response model for an ARM PUT/GET/POST operation, any property that contains sensitive information (such as passwords, keys, tokens, credentials, or other secrets) must include the `"x-ms-secret": true` annotation. This ensures that secrets are properly identified and handled according to ARM security guidelines.

The rule checks string properties in schema definitions by name, case-insensitively. It matches the exact name `password` and names ending in `passphrase` (including `passphrase` itself). It also matches names ending in `access`, `credential`, `secret`, `password`, `key`, `token`, `auth`, or `connection` when the name does not also start with that keyword. For example, `accountPassword` is matched, but `passwordPolicy`, `passwordHash`, and `passphraseHint` are not.

Properties already marked `"x-ms-secret": true`, non-string properties, enums, `x-ms-enum` schemas, names containing `public`, and key/value pairs are excluded. Generic names such as `key` and `value` and property descriptions are not used to infer sensitivity. The rule checks schema annotations, not example values or runtime response redaction.

## How to fix the violation

To fix this violation, review the response model for your ARM PUT/GET/POST operation and identify all properties that store secrets (such as `password`, `key`, `access`, `credentials`, `token`, `secret`, `auth`). For each of these properties, add the `"x-ms-secret": true` annotation to ensure they are properly marked as secrets. This helps protect sensitive information and complies with ARM guidelines.

Note: `The ARM reviewers have determined that the property is a false positive and have verified that it does not contain any secrets, they can suppress the error.`

## Good example

```json5
"Resource": {
  "description": "The resource",
  "properties": {
    "password": {
      "type": "string",
      "description": "secret",
      "x-ms-secret": true
    },
    "accessKey": {
      "type": "string",
      "description": "secret",
      "x-ms-secret": true
    },
    "key": {
      "type": "string",
      "description": "secret",
      "x-ms-secret": true
    },
    "token": {
      "type": "string",
      "description": "secret",
      "x-ms-secret": true
    },
    "credentials": {
      "type": "string",
      "description": "secret",
      "x-ms-secret": true
    },
    "secret": {
      "type": "string",
      "description": "secret",
      "x-ms-secret": true
    },
    "auth": {
      "type": "string",
      "description": "secret",
      "x-ms-secret": true
    }
  }
}
```

## Bad example

```json5
"Resource": {
  "description": "The resource",
  "properties": {
    "password": {
      "type": "string",
      "description": "secret"
      // No x-ms-secret annotation
    }
  }
}
```