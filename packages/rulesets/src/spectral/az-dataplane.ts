import { oas2 } from "@stoplight/spectral-formats"
import common from "./az-common"
import hostParameters from "./functions/host-parameters"
const ruleset: any = {
  extends: [common],
  rules: {
    HostParametersValidation: {
      description: "Validate the parameters in x-ms-parameterized-host.",
      message: "{{error}}",
      severity: "error",
      resolved: true,
      formats: [oas2],
      given: ["$.x-ms-parameterized-host"],
      then: {
        function: hostParameters,
      },
    },
  },
}

export default ruleset
