# LicenseHeaderMustNotBeSpecified

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

License header must not be specified inside x-ms-code-generation-settings. The license can vary for different SDKs generated and is passed via command line/config file when generating the SDK.

## Description

`x-ms-code-generation-settings` must not have the license section specified in the OpenAPI documents since each generated SDK can have a different licensing header. This information must be provided either from the command line or the configuration file when actually generating the sdk.

## How to fix the violation

Ensure the `x-ms-code-generation-settings` section does not have `header` property.
