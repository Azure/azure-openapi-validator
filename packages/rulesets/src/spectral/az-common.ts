import {oas2, oas3} from "@stoplight/spectral-formats"
import {casing, falsy, pattern, truthy, undefined} from "@stoplight/spectral-functions";
import {oas} from "@stoplight/spectral-rulesets"
import consistentresponsebody from "./functions/consistent-response-body";
import delete204response from "./functions/delete-204-response";
import errorresponse from "./functions/error-response";
import hasheader from "./functions/has-header";
import operationid from "./functions/operation-id";
import paginationresponse from "./functions/pagination-response";
import paramnamesunique from "./functions/param-names-unique";
import paramnames from "./functions/param-names";
import paramorder from "./functions/param-order";
import patchcontenttype from "./functions/patch-content-type";
import pathparamnames from "./functions/path-param-names";
import pathparamschema from "./functions/path-param-schema";
import versionpolicy from "./functions/version-policy";
import defaultInEnum from "./functions/default-in-enum";
import enumInsteadOfBoolean from "./functions/enum-insteadof-boolean";
import avoidAnonymousParameter from "./functions/avoid-anonymous-parameter";
const ruleset : any = {
  extends:[
    oas
  ],
  rules: {
    "info-contact": "off",
    "no-$ref-siblings": "off",
    "az-additional-properties-and-properties": {
      "description": "Don't specify additionalProperties as a sibling of properties.",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": "$..[?(@object() && @.type === 'object' && @.properties)]",
      "then": {
        "field": "additionalProperties",
        "function": falsy
      }
    },
    "az-additional-properties-object": {
      "description": "additionalProperties with type object is a common error.",
      "severity": "info",
      "formats": [oas2, oas3],
      "resolved": false,
      "given": "$..[?(@property == 'additionalProperties' && @.type == 'object' && @.properties == undefined)]",
      "then": {
        "function": falsy
      }
    },
    "az-api-version-enum": {
      "description": "The api-version parameter should not be an enum.",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": ["$.paths[*].parameters.[?(@.name == 'api-version')]", "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.name == 'api-version')]"],
      "then": {
        "field": "enum",
        "function": falsy
      }
    },
    "az-consistent-response-body": {
      "description": "Ensure the get, put, and patch response body schemas are consistent.",
      "message": "{{error}}",
      "severity": "warn",
      "formats": [oas2],
      "given": "$.paths.*",
      "then": {
        "function": consistentresponsebody
      }
    },
    "az-default-response": {
      "description": "All operations should have a default (error) response.",
      "message": "Operation is missing a default response.",
      "severity": "warn",
      "given": "$.paths.*.*.responses",
      "then": {
        "field": "default",
        "function": truthy
      }
    },
    "az-delete-204-response": {
      "description": "A delete operation should have a 204 response.",
      "message": "A delete operation should have a `204` response.",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": "$.paths[*].delete.responses",
      "then": {
        "function": delete204response
      }
    },
    "az-error-response": {
      "description": "Error response body should conform to Microsoft Azure API Guidelines.",
      "message": "{{error}}",
      "severity": "warn",
      "formats": [oas2],
      "given": "$.paths[*][*].responses",
      "then": {
        "function": errorresponse
      }
    },
    "az-formdata": {
      "description": "Check for appropriate use of formData parameters.",
      "severity": "info",
      "formats": [oas2],
      "given": "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.in == \"formData\")]",
      "then": {
        "function": falsy
      }
    },
    "az-header-disallowed": {
      "description": "Authorization, Content-type, and Accept headers should not be defined explicitly.",
      "message": "Header parameter \"{{value}}\" should not be defined explicitly.",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": ["$.paths[*].parameters.[?(@.in == 'header')]", "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.in == 'header')]"],
      "then": {
        "function": pattern,
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
      "formats": [oas2],
      "given": "$.paths[*][*].responses[?(@property == '202')]^^",
      "then": {
        "field": "x-ms-long-running-operation",
        "function": truthy
      }
    },
    "az-lro-headers": {
      "description": "A 202 response should include an Operation-Location response header.",
      "message": "A 202 response should include an Operation-Location response header.",
      "severity": "warn",
      "formats": [oas2],
      "given": "$.paths[*][*].responses[?(@property == '202')]",
      "then": {
        "function": hasheader,
        "functionOptions": {
          "name": "Operation-location"
        }
      }
    },
    "az-ms-paths": {
      "description": "Don't use x-ms-paths except where necessary to support legacy APIs.",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": "$.x-ms-paths",
      "then": {
        "function": falsy
      }
    },
    "az-nullable": {
      "description": "Avoid the use of x-nullable.",
      "severity": "warn",
      "formats": [oas2, oas3],
      "resolved": false,
      "given": "$..x-nullable",
      "then": {
        "function": undefined
      }
    },
    "az-operation-id": {
      "description": "OperationId should conform to Azure API Guidelines",
      "message": "{{error}}",
      "severity": "warn",
      "given": ["$.paths.*[get,put,post,patch,delete,options,head]"],
      "then": {
        "function": operationid
      }
    },
    "az-operation-summary-or-description": {
      "description": "Operation should have a summary or description.",
      "message": "Operation should have a summary or description.",
      "severity": "warn",
      "given": ["$.paths[*][?( @property === 'get' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'put' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'post' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'patch' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'delete' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'options' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'head' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'trace' && !@.summary && !@.description )]"],
      "then": {
        "function": falsy
      }
    },
    "az-pagination-response": {
      "description": "An operation that returns a list that is potentially large should support pagination.",
      "message": "{{error}}",
      "severity": "warn",
      "formats": [oas2],
      "given": ["$.paths.*[get,post]"],
      "then": {
        "function": paginationresponse
      }
    },
    "az-parameter-default-not-allowed": {
      "description": "A required parameter should not specify a default value.",
      "severity": "warn",
      "given": ["$.paths[*].parameters.[?(@.required)]", "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.required)]"],
      "then": {
        "field": "default",
        "function": falsy
      }
    },
    "az-parameter-description": {
      "description": "All parameters should have a description.",
      "message": "Parameter should have a description.",
      "severity": "warn",
      "given": ["$.paths[*].parameters.*", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*"],
      "then": {
        "field": "description",
        "function": truthy
      }
    },
    "az-parameter-names-convention": {
      "description": "Parameter names should conform to Azure naming conventions.",
      "message": "{{error}}",
      "severity": "warn",
      "given": ["$.paths[*].parameters.*", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*"],
      "then": {
        "function": paramnames
      }
    },
    "az-parameter-names-unique": {
      "description": "All parameter names for an operation should be case-insensitive unique.",
      "message": "{{error}}",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": "$.paths[*]",
      "then": {
        "function": paramnamesunique
      }
    },
    "az-parameter-order": {
      "description": "Path parameters must be in the same order as in the path.",
      "message": "{{error}}",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": "$.paths",
      "then": {
        "function": paramorder
      }
    },
    "az-path-parameter-names": {
      "description": "Path parameter names should be consistent across all paths.",
      "message": "{{error}}",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": "$.paths",
      "then": {
        "function": pathparamnames
      }
    },
    "az-patch-content-type": {
      "description": "The request body content type for patch operations should be JSON merge patch.",
      "message": "{{error}}",
      "severity": "warn",
      "formats": [oas2],
      "given": "$",
      "then": {
        "function": patchcontenttype
      }
    },
    "az-path-characters": {
      "description": "Path should contain only recommended characters.",
      "message": "Path contains non-recommended characters.",
      "severity": "info",
      "formats": [oas2, oas3],
      "given": "$.paths.*~",
      "then": {
        "function": pattern,
        "functionOptions": {
          "match": "^(/([0-9A-Za-z._~-]+|{[^}]+}))*(/([0-9A-Za-z._~:-]+|{[^}]*}(:[0-9A-Za-z._~-]+)?))$"
        }
      }
    },
    "az-path-parameter-schema": {
      "description": "Path parameter should be type: string and specify maxLength and pattern.",
      "message": "{{error}}",
      "severity": "info",
      "formats": [oas2, oas3],
      "given": ["$.paths[*].parameters[?(@.in == 'path')]", "$.paths.*[get,put,post,patch,delete,options,head].parameters[?(@.in == 'path')]"],
      "then": {
        "function": pathparamschema
      }
    },
    "az-post-201-response": {
      "description": "Using post for a create operation is discouraged.",
      "message": "Using post for a create operation is discouraged.",
      "severity": "warn",
      "formats": [oas2],
      "given": "$.paths[*].post.responses",
      "then": {
        "field": "201",
        "function": falsy
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
        "function": truthy
      }
    },
    "az-property-names-convention": {
      "description": "Property names should be camel case.",
      "message": "Property name should be camel case.",
      "severity": "warn",
      "resolved": false,
      "given": "$..[?(@.type === 'object' && @.properties)].properties.*~",
      "then": {
        "function": casing,
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
        "function": truthy
      }
    },
    "az-put-path": {
      "description": "The path for a put should have a final path parameter.",
      "message": "The path for a put should have a final path parameter.",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": "$.paths[*].put^~",
      "then": {
        "function": pattern,
        "functionOptions": {
          "match": "/\\}$/"
        }
      }
    },
    "az-request-body-not-allowed": {
      "description": "A get or delete operation must not accept a body parameter.",
      "severity": "error",
      "formats": [oas2],
      "given": ["$.paths[*].[get,delete].parameters[*]"],
      "then": {
        "field": "in",
        "function": pattern,
        "functionOptions": {
          "notMatch": "/^body$/"
        }
      }
    },
    "az-request-body-optional": {
      "description": "Flag optional request body -- common oversight.",
      "message": "The body parameter is not marked as required.",
      "severity": "info",
      "formats": [oas2],
      "given": ["$.paths[*].[put,post,patch].parameters.[?(@.in == 'body')]"],
      "then": {
        "field": "required",
        "function": truthy
      }
    },
    "az-schema-description-or-title": {
      "description": "All schemas should have a description or title.",
      "message": "Schema should have a description or title.",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": ["$.definitions[?(!@.description && !@.title)]", "$.components.schemas[?(!@.description && !@.title)]"],
      "then": {
        "function": falsy
      }
    },
    "az-schema-names-convention": {
      "description": "Schema names should be Pascal case.",
      "message": "Schema name should be Pascal case.",
      "severity": "info",
      "formats": [oas2],
      "given": "$.definitions.*~",
      "then": {
        "function": casing,
        "functionOptions": {
          "type": "pascal"
        }
      }
    },
    "az-security-definition-description": {
      "description": "A security definition should have a description.",
      "message": "Security definition should have a description.",
      "severity": "warn",
      "formats": [oas2, oas3],
      "given": ["$.securityDefinitions[*]", "$.components.securitySchemes[*]"],
      "then": {
        "field": "description",
        "function": truthy
      }
    },
    "az-success-response-body": {
      "description": "All success responses except 202 & 204 should define a response body.",
      "severity": "warn",
      "formats": [oas2],
      "given": "$.paths[*][*].responses[?(@property >= 200 && @property < 300 && @property != '202' && @property != '204')]",
      "then": {
        "field": "schema",
        "function": truthy
      }
    },
    "az-version-convention": {
      "description": "API version should be a date in YYYY-MM-DD format, optionally suffixed with '-preview'.",
      "severity": "error",
      "formats": [oas2, oas3],
      "given": "$.info.version",
      "then": {
        "function": pattern,
        "functionOptions": {
          "match": "^\\d\\d\\d\\d-\\d\\d-\\d\\d(-preview)?$"
        }
      }
    },
    "az-version-policy": {
      "description": "Specify API version using `api-version` query parameter, not in path.",
      "message": "{{error}}",
      "severity": "warn",
      "formats": [oas2],
      "given": "$",
      "then": {
        "function": versionpolicy
      }
    },
    "az-default-in-enum": {
      "description": "This rule applies when the value specified by the default property does not appear in the enum constraint for a schema.",
      "message": "Default value should appear in the enum constraint for a schema",
      "severity": "error",
      "formats": [oas2],
      "given": "$..[?(@.enum)]",
      "then": {
        "function": defaultInEnum
      }
    },
    "az-enum-insteadOf-boolean": {
      "description": "Booleans properties are not descriptive in all cases and can make them to use, evaluate whether is makes sense to keep the property as boolean or turn it into an enum.",
      "message": "Booleans properties are not descriptive in all cases and can make them to use, evaluate whether is makes sense to keep the property as boolean or turn it into an enum.",
      "severity": "warn",
      "resolved": false,
      "formats": [oas2],
      "given": "$..[?(@.type === 'boolean')]",
      "then": {
        "function": enumInsteadOfBoolean
      }
    },
    "az-avoid-anonymous-parameter": {
      "description": "Inline/anonymous models must not be used, instead define a schema with a model name in the \"definitions\" section and refer to it. This allows operations to share the models.",
      "message": "Inline/anonymous models must not be used, instead define a schema with a model name in the \"definitions\" section and refer to it. This allows operations to share the models.",
      "severity": "error",
      "resolved": false,
      "formats": [oas2],
      "given": ["$.paths[*].parameters.*", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*"],
      "then": {
        "function": avoidAnonymousParameter
      }
    }
  }
};
export default ruleset