import { oas2 } from "@stoplight/spectral-formats"
import {pattern, falsy, truthy} from "@stoplight/spectral-functions"
import avoidMsdnReferences from "./functions/avoid-msdn-references";
import descriptiveDescriptionRequired from "./functions/descriptive-description-required";
import xmsClientNameParameter from "./functions/xms-client-name-parameter";
import xmsClientNameProperty from "./functions/xms-client-name-property";
import xmsExamplesRequired from "./functions/xms-examples-required";

const ruleset: any = {
  extends: [],
  rules: {
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
   XmsExamplesRequired: {
      description: 'Verifies whether `x-ms-examples` are provided for each operation or not.',
      message: 'Please provide x-ms-examples describing minimum/maximum property set for response/request payloads for operations.',
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$.paths.*[get,put,post,patch,delete,options,head]"],
      then: {
        function: xmsExamplesRequired
      }
   },
   XmsClientNameParameter: {
      description:
          'The `x-ms-client-name` extension is used to change the name of a parameter or property in the generated code. ' +
          'By using the `x-ms-client-name` extension, a name can be defined for use specifically in code generation, separately from the name on the wire. ' +
          'It can be used for query parameters and header parameters, as well as properties of schemas. This name is case sensitive.',
      message:
          'Value of `x-ms-client-name` cannot be the same as Property/Model.',
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$.paths.*[get,put,post,patch,delete,options,head].parameters[?(@.name && @['x-ms-client-name'])]","$.parameters.[?(@.name && @['x-ms-client-name'])]"],
      then: {
          function: xmsClientNameParameter
      }
   },
   XmsClientNameProperty: {
      description:
          'The `x-ms-client-name` extension is used to change the name of a parameter or property in the generated code.' +
          'By using the `x-ms-client-name` extension, a name can be defined for use specifically in code generation, separately from the name on the wire.' +
          'It can be used for query parameters and header parameters, as well as properties of schemas. This name is case sensitive.',
      message:
          'Value of `x-ms-client-name` cannot be the same as Property/Model.',
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$.definitions[*].properties.*['x-ms-client-name']"],
      then: {
          function: xmsClientNameProperty
      }
   },
   ListInOperationName: {
      description: 'Verifies whether value for `operationId` is named as per ARM guidelines when response contains array of items.',
      message: 'Since operation response has model definition, it should be of the form "_list".',
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$.paths.*[get]['x-ms-pageable']^.operationId"],
      then: {
          function: pattern,
          functionOptions: {
              match: "^((\\w+\\_List\\w*)|List)$"
          }
      }
   },
   DescriptiveDescriptionRequired: {
      description: 'The value of the \'description\' property must be descriptive. It cannot be spaces or empty description.',
      message:
          'The value provided for description is not descriptive enough. Accurate and descriptive description is essential for maintaining reference documentation.',
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$..[?(@object() && @.description)].description"],
      then: {
          function: descriptiveDescriptionRequired
      },
   },
   AvoidNestedProperties: {
      description:
          'Nested properties can result into bad user experience especially when creating request objects. `x-ms-client-flatten` flattens the model properties so that the users can analyze and set the properties much more easily.',
      message: 'Consider using x-ms-client-flatten to provide a better end user experience',
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$..[?(@object() && @.properties)][?(@object() && @.properties)].properties"],
      then: {
          field: "x-ms-client-flatten",
          function: truthy
      },
   },
   AvoidMsdnReferences: {
      description:
          'The documentation is being generated from the OpenAPI(swagger) and published at "docs.microsoft.com". From that perspective, documentation team would like to avoid having links to the "msdn.microsoft.com" in the OpenAPI(swagger) and SDK documentations.',
      message:
          'For better generated code quality, remove all references to "msdn.microsoft.com".',
      severity: "warn",
      resolved: false,
      formats: [oas2],
      given: ["$..[?(@property === 'externalDocs')].","$.info.description"],
      then: {
          function: avoidMsdnReferences,
      },
   },
  },
}
export default ruleset
