# DeprecatedXmsCodeGenerationSetting

## Category

SDK Warning

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

The x-ms-code-generation-setting extension is being deprecated. Please remove it and move settings to readme file for code generation.

## Description

The x-ms-code-generation-settings is being deprecated. AutoRest (v3) is using settings in readme file for code generation and will stop supporting it inside the swagger file. Please ensure to remove the parameter from swagger spec and move settings to readme.

## CreatedAt

March 18, 2020

## LastModifiedAt

March 18, 2020

## How to fix the violation

Since the only value of this extension today is to override the client name, which could be done with a 'title' line in the readme file,you could remove the extension from swagger spec and move settings to readme.

The following would be invalid:

```json
 "info": {
    "version": "2016-05-16",
    "x-ms-code-generation-settings": {
      "name": "AnalysisServicesManagementClient"
    }
  }
```
