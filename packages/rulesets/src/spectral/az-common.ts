import { oas2 } from "@stoplight/spectral-formats"
import { pattern , falsy } from "@stoplight/spectral-functions"

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
  },
}
export default ruleset
