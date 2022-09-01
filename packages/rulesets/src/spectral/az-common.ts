import { oas2 } from "@stoplight/spectral-formats"
import { pattern , falsy } from "@stoplight/spectral-functions"
import { lroStatusCodesReturnTypeSchema } from "./functions/lro-status-codes-return-type-schema";
import { namePropertyDefinitionInParameter } from "./functions/name-property-definition-in-parameter";
import { operationIdNounConflictingModelNames } from "./functions/operation-id-noun-conflicting-model-names";
import { operationIdNounVerb } from "./functions/operation-id-noun-verb";
import { operationIdSingleUnderscore } from "./functions/one-underscore-in-operation-id";
import { getInOperationName } from "./functions/get-in-operation-name";
import { putInOperationName } from "./functions/put-in-operation-name";
import { patchInOperationName } from "./functions/patch-in-operation-name";
import { deleteInOperationName } from "./functions/delete-in-operation-name";
import { parameterNotDefinedInGlobalParameters } from "./functions/parameter-not-defined-in-global-parameters";
import { putRequestResponseScheme } from "./functions/put-request-response-scheme";
import { requiredReadOnlyProperties } from "./functions/required-read-only-properties";

const ruleset: any = {
  extends: [],
  rules: {
    RequiredReadOnlyProperties: {
      description: "A model property cannot be both `readOnly` and `required`. A `readOnly` property is something that the server sets when returning the model object while `required` is a property to be set when sending it as a part of the request body.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: ["$..?(@property === 'required')^"],
      then: {
        function: requiredReadOnlyProperties,
      },
    },
    PutRequestResponseScheme: {
      description: "The request & response('200') schema of the PUT operation must be same.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[put][responses][?(@property === '200')]^^"],
      then: {
        function: putRequestResponseScheme,
      },
    },
    ParameterNotDefinedInGlobalParameters: {
      description: "Per ARM guidelines, if `subscriptionId` is used anywhere as a path parameter, it must always be defined as global parameter. `api-version` is almost always an input parameter in any ARM spec and must also be defined as a global parameter.",
      message: "{{error}}",
      severity: "error",
      resolved: false,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'parameters')]"],
      then: {
        function: parameterNotDefinedInGlobalParameters,
      },
    },
    DeleteInOperationName: {
      description: "Verifies whether value for `operationId` is named as per ARM guidelines.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[delete][?(@property === 'operationId')]"],
      then: {
        function: deleteInOperationName,
      },
    },
    PatchInOperationName: {
      description: "Verifies whether value for `operationId` is named as per ARM guidelines.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[patch][?(@property === 'operationId')]"],
      then: {
        function: patchInOperationName,
      },
    },
    PutInOperationName: {
      description: "Verifies whether value for `operationId` is named as per ARM guidelines.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[put][?(@property === 'operationId')]"],
      then: {
        function: putInOperationName,
      },
    },
    GetInOperationName: {
      description: "Verifies whether value for `operationId` is named as per ARM guidelines.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[get][?(@property === 'operationId')]"],
      then: {
        function: getInOperationName,
      },
    },
    OperationIdSingleUnderscore: {
      description: "An operationId can have exactly one underscore, not adhering to it can cause errors in code generation.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'operationId')]"],
      then: {
        function: operationIdSingleUnderscore,
      },
    },
    OperationIdNounVerb: {
      description: "OperationId should be of the form `Noun_Verb`.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'operationId')]"],
      then: {
        function: operationIdNounVerb,
      },
    },
    OperationIdNounConflictingModelNames: {
      description: "The first part of an operation Id separated by an underscore i.e., `Noun` in a `Noun_Verb` should not conflict with names of the models defined in the definitions section. If this happens, AutoRest appends `Model` to the name of the model to resolve the conflict (`NounModel` in given example) with the name of the client itself (which will be named as `Noun` in given example). This can result in an inconsistent user experience.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'operationId')]"],
      then: {
        function: operationIdNounConflictingModelNames,
      },
    },
    NamePropertyDefinitionInParameter: {
      description: "A parameter must have a `name` property for the SDK to be properly generated.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'parameters')]"],
      then: {
        function: namePropertyDefinitionInParameter,
      },
    },
    LroStatusCodesReturnTypeSchema: {
      description: "The '200'/'201' responses of the long running operation must have a schema definition.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$[paths,'x-ms-paths'].*[put][?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
      then: {
        function: lroStatusCodesReturnTypeSchema,
      },
    },
    docLinkLocale: {
      description: "This rule is to ensure the documentation link in the description does not contains any locale.",
      message: "The documentation link in the description contains locale info, please change it to the link without locale.",
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: [
        "$..[?(@property === 'description')]^",
      ],
      then: {
        function: pattern,
        functionOptions:{
          match: "https://docs.microsoft.com/\\w+\\-\\w+/azure/.*"
        }
      },
    },
    InvalidVerbUsed: {
      description: `Each operation definition must have a HTTP verb and it must be DELETE/GET/PUT/PATCH/HEAD/OPTIONS/POST/TRACE.`,
      message: "Permissible values for HTTP Verb are DELETE, GET, PUT, PATCH, HEAD, OPTIONS, POST, TRACE.",
      severity: "error",
      resolved: false,
      given: "$[paths,'x-ms-paths'].*[?(!@property.match(/^(DELETE|GET|PUT|PATCH|HEAD|OPTIONS|POST|TRACE|PARAMETERS)$/i))]",
      then: {
        function: falsy,
      },
    },
  },
}
export default ruleset
