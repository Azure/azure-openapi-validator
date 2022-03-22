"use strict";
const spectral_formats_1 = require("@stoplight/spectral-formats");
const spectral_functions_1 = require("@stoplight/spectral-functions");
const spectral_rulesets_1 = require("@stoplight/spectral-rulesets");
const consistent_response_body_1 = __importDefault(require("./functions/consistent-response-body"));
const delete_204_response_1 = __importDefault(require("./functions/delete-204-response"));
const error_response_1 = __importDefault(require("./functions/error-response"));
const has_header_1 = __importDefault(require("./functions/has-header"));
const operation_id_1 = __importDefault(require("./functions/operation-id"));
const pagination_response_1 = __importDefault(require("./functions/pagination-response"));
const param_names_unique_1 = __importDefault(require("./functions/param-names-unique"));
const param_names_1 = __importDefault(require("./functions/param-names"));
const param_order_1 = __importDefault(require("./functions/param-order"));
const patch_content_type_1 = __importDefault(require("./functions/patch-content-type"));
const path_param_names_1 = __importDefault(require("./functions/path-param-names"));
const path_param_schema_1 = __importDefault(require("./functions/path-param-schema"));
const version_policy_1 = __importDefault(require("./functions/version-policy"));
const ruleset = {
    extends: [
        spectral_rulesets_1.oas
    ],
    rules: {
        "info-contact": "off",
        "no-$ref-siblings": "off",
        "az-additional-properties-and-properties": {
            "description": "Don't specify additionalProperties as a sibling of properties.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$..[?(@object() && @.type === 'object' && @.properties)]",
            "then": {
                "field": "additionalProperties",
                "function": spectral_functions_1.falsy
            }
        },
        "az-additional-properties-object": {
            "description": "additionalProperties with type object is a common error.",
            "severity": "info",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "resolved": false,
            "given": "$..[?(@property == 'additionalProperties' && @.type == 'object' && @.properties == undefined)]",
            "then": {
                "function": spectral_functions_1.falsy
            }
        },
        "az-api-version-enum": {
            "description": "The api-version parameter should not be an enum.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": ["$.paths[*].parameters.[?(@.name == 'api-version')]", "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.name == 'api-version')]"],
            "then": {
                "field": "enum",
                "function": spectral_functions_1.falsy
            }
        },
        "az-consistent-response-body": {
            "description": "Ensure the get, put, and patch response body schemas are consistent.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths.*",
            "then": {
                "function": consistent_response_body_1.default
            }
        },
        "az-default-response": {
            "description": "All operations should have a default (error) response.",
            "message": "Operation is missing a default response.",
            "severity": "warn",
            "given": "$.paths.*.*.responses",
            "then": {
                "field": "default",
                "function": spectral_functions_1.truthy
            }
        },
        "az-delete-204-response": {
            "description": "A delete operation should have a 204 response.",
            "message": "A delete operation should have a `204` response.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths[*].delete.responses",
            "then": {
                "function": delete_204_response_1.default
            }
        },
        "az-error-response": {
            "description": "Error response body should conform to Microsoft Azure API Guidelines.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths[*][*].responses",
            "then": {
                "function": error_response_1.default
            }
        },
        "az-formdata": {
            "description": "Check for appropriate use of formData parameters.",
            "severity": "info",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.in == \"formData\")]",
            "then": {
                "function": spectral_functions_1.falsy
            }
        },
        "az-header-disallowed": {
            "description": "Authorization, Content-type, and Accept headers should not be defined explicitly.",
            "message": "Header parameter \"{{value}}\" should not be defined explicitly.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": ["$.paths[*].parameters.[?(@.in == 'header')]", "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.in == 'header')]"],
            "then": {
                "function": spectral_functions_1.pattern,
                "field": "name",
                "functionOptions": {
                    "notMatch": "/^(authorization|content-type|accept)$/i"
                }
            }
        },
        "az-lro-extension": {
            "description": "Operations with a 202 response should specify `x-ms-long-running-operation: true`.",
            "message": "Operations with a 202 response should specify `x-ms-long-running-operation: true`.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths[*][*].responses[?(@property == '202')]^^",
            "then": {
                "field": "x-ms-long-running-operation",
                "function": spectral_functions_1.truthy
            }
        },
        "az-lro-headers": {
            "description": "A 202 response should include an Operation-Location response header.",
            "message": "A 202 response should include an Operation-Location response header.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths[*][*].responses[?(@property == '202')]",
            "then": {
                "function": has_header_1.default,
                "functionOptions": {
                    "name": "Operation-location"
                }
            }
        },
        "az-ms-paths": {
            "description": "Don't use x-ms-paths except where necessary to support legacy APIs.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.x-ms-paths",
            "then": {
                "function": spectral_functions_1.falsy
            }
        },
        "az-nullable": {
            "description": "Avoid the use of x-nullable.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "resolved": false,
            "given": "$..x-nullable",
            "then": {
                "function": spectral_functions_1.undefined
            }
        },
        "az-operation-id": {
            "description": "OperationId should conform to Azure API Guidelines",
            "message": "{{error}}",
            "severity": "warn",
            "given": ["$.paths.*[get,put,post,patch,delete,options,head]"],
            "then": {
                "function": operation_id_1.default
            }
        },
        "az-operation-summary-or-description": {
            "description": "Operation should have a summary or description.",
            "message": "Operation should have a summary or description.",
            "severity": "warn",
            "given": ["$.paths[*][?( @property === 'get' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'put' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'post' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'patch' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'delete' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'options' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'head' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'trace' && !@.summary && !@.description )]"],
            "then": {
                "function": spectral_functions_1.falsy
            }
        },
        "az-pagination-response": {
            "description": "An operation that returns a list that is potentially large should support pagination.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": ["$.paths.*[get,post]"],
            "then": {
                "function": pagination_response_1.default
            }
        },
        "az-parameter-default-not-allowed": {
            "description": "A required parameter should not specify a default value.",
            "severity": "warn",
            "given": ["$.paths[*].parameters.[?(@.required)]", "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.required)]"],
            "then": {
                "field": "default",
                "function": spectral_functions_1.falsy
            }
        },
        "az-parameter-description": {
            "description": "All parameters should have a description.",
            "message": "Parameter should have a description.",
            "severity": "warn",
            "given": ["$.paths[*].parameters.*", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*"],
            "then": {
                "field": "description",
                "function": spectral_functions_1.truthy
            }
        },
        "az-parameter-names-convention": {
            "description": "Parameter names should conform to Azure naming conventions.",
            "message": "{{error}}",
            "severity": "warn",
            "given": ["$.paths[*].parameters.*", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*"],
            "then": {
                "function": param_names_1.default
            }
        },
        "az-parameter-names-unique": {
            "description": "All parameter names for an operation should be case-insensitive unique.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths[*]",
            "then": {
                "function": param_names_unique_1.default
            }
        },
        "az-parameter-order": {
            "description": "Path parameters must be in the same order as in the path.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths",
            "then": {
                "function": param_order_1.default
            }
        },
        "az-path-parameter-names": {
            "description": "Path parameter names should be consistent across all paths.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths",
            "then": {
                "function": path_param_names_1.default
            }
        },
        "az-patch-content-type": {
            "description": "The request body content type for patch operations should be JSON merge patch.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$",
            "then": {
                "function": patch_content_type_1.default
            }
        },
        "az-path-characters": {
            "description": "Path should contain only recommended characters.",
            "message": "Path contains non-recommended characters.",
            "severity": "info",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths.*~",
            "then": {
                "function": spectral_functions_1.pattern,
                "functionOptions": {
                    "match": "^(/([0-9A-Za-z._~-]+|{[^}]+}))*(/([0-9A-Za-z._~:-]+|{[^}]*}(:[0-9A-Za-z._~-]+)?))$"
                }
            }
        },
        "az-path-parameter-schema": {
            "description": "Path parameter should be type: string and specify maxLength and pattern.",
            "message": "{{error}}",
            "severity": "info",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": ["$.paths[*].parameters[?(@.in == 'path')]", "$.paths.*[get,put,post,patch,delete,options,head].parameters[?(@.in == 'path')]"],
            "then": {
                "function": path_param_schema_1.default
            }
        },
        "az-post-201-response": {
            "description": "Using post for a create operation is discouraged.",
            "message": "Using post for a create operation is discouraged.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths[*].post.responses",
            "then": {
                "field": "201",
                "function": spectral_functions_1.falsy
            }
        },
        "az-property-description": {
            "description": "All schema properties should have a description.",
            "message": "Property should have a description.",
            "severity": "warn",
            "resolved": false,
            "given": "$..properties[?(@object() && @.$ref == undefined)]",
            "then": {
                "field": "description",
                "function": spectral_functions_1.truthy
            }
        },
        "az-property-names-convention": {
            "description": "Property names should be camel case.",
            "message": "Property name should be camel case.",
            "severity": "warn",
            "resolved": false,
            "given": "$..[?(@.type === 'object' && @.properties)].properties.*~",
            "then": {
                "function": spectral_functions_1.casing,
                "functionOptions": {
                    "type": "camel"
                }
            }
        },
        "az-property-type": {
            "description": "All schema properties should have a defined type.",
            "message": "Property should have a defined type.",
            "severity": "warn",
            "resolved": false,
            "given": "$..properties[?(@object() && @.$ref == undefined)]",
            "then": {
                "field": "type",
                "function": spectral_functions_1.truthy
            }
        },
        "az-put-path": {
            "description": "The path for a put should have a final path parameter.",
            "message": "The path for a put should have a final path parameter.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths[*].put^~",
            "then": {
                "function": spectral_functions_1.pattern,
                "functionOptions": {
                    "match": "/\\}$/"
                }
            }
        },
        "az-request-body-not-allowed": {
            "description": "A get or delete operation must not accept a body parameter.",
            "severity": "error",
            "formats": [spectral_formats_1.oas2],
            "given": ["$.paths[*].[get,delete].parameters[*]"],
            "then": {
                "field": "in",
                "function": spectral_functions_1.pattern,
                "functionOptions": {
                    "notMatch": "/^body$/"
                }
            }
        },
        "az-request-body-optional": {
            "description": "Flag optional request body -- common oversight.",
            "message": "The body parameter is not marked as required.",
            "severity": "info",
            "formats": [spectral_formats_1.oas2],
            "given": ["$.paths[*].[put,post,patch].parameters.[?(@.in == 'body')]"],
            "then": {
                "field": "required",
                "function": spectral_functions_1.truthy
            }
        },
        "az-schema-description-or-title": {
            "description": "All schemas should have a description or title.",
            "message": "Schema should have a description or title.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": ["$.definitions[?(!@.description && !@.title)]", "$.components.schemas[?(!@.description && !@.title)]"],
            "then": {
                "function": spectral_functions_1.falsy
            }
        },
        "az-schema-names-convention": {
            "description": "Schema names should be Pascal case.",
            "message": "Schema name should be Pascal case.",
            "severity": "info",
            "formats": [spectral_formats_1.oas2],
            "given": "$.definitions.*~",
            "then": {
                "function": spectral_functions_1.casing,
                "functionOptions": {
                    "type": "pascal"
                }
            }
        },
        "az-security-definition-description": {
            "description": "A security definition should have a description.",
            "message": "Security definition should have a description.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": ["$.securityDefinitions[*]", "$.components.securitySchemes[*]"],
            "then": {
                "field": "description",
                "function": spectral_functions_1.truthy
            }
        },
        "az-success-response-body": {
            "description": "All success responses except 202 & 204 should define a response body.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths[*][*].responses[?(@property >= 200 && @property < 300 && @property != '202' && @property != '204')]",
            "then": {
                "field": "schema",
                "function": spectral_functions_1.truthy
            }
        },
        "az-version-convention": {
            "description": "API version should be a date in YYYY-MM-DD format, optionally suffixed with '-preview'.",
            "severity": "error",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.info.version",
            "then": {
                "function": spectral_functions_1.pattern,
                "functionOptions": {
                    "match": "^\\d\\d\\d\\d-\\d\\d-\\d\\d(-preview)?$"
                }
            }
        },
        "az-version-policy": {
            "description": "Specify API version using `api-version` query parameter, not in path.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$",
            "then": {
                "function": version_policy_1.default
            }
        }
    }
};
module.exports = ruleset;
//# sourceMappingURL=common.js.map