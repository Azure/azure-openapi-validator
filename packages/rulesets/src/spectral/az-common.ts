import { oas2 } from "@stoplight/spectral-formats"
import { pattern } from "@stoplight/spectral-functions"

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
          match: "https://docs.microsoft.com/\w+\-\w+/azure/.*"
        }
      },
   }
  },
}
export default ruleset
