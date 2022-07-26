import { casing } from "@stoplight/spectral-functions"

const ruleset: any = {
  extends: [],
  rules: {
    // this rule equivalent to BodyPropertiesNamesCamelCase
    PropertyNamesConvention: {
      description: "Property names should be camel case.",
      message: "Property name should be camel case.",
      severity: "warn",
      resolved: false,
      given: "$..[?(@.type === 'object' && @.properties)].properties.*~",
      then: {
        function: casing,
        functionOptions: {
          type: "camel",
        },
      },
    },
  },
}
export default ruleset
