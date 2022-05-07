import { oas2 } from "@stoplight/spectral-formats";
import { oas } from "@stoplight/spectral-rulesets"
import common from "./az-common"
import hasApiVersionParameter from "./functions/has-api-version-parameter";
const ruleset:any = {
  extends:[
    [common,"all"],
    [oas,"off"] 
  ],
  rules: {
    "oas2-api-host": true,
    "ApiVersionParameterRequired":{
      "description": "All operations should have api-version query parameter.",
      "message": "{{error}}",
      "severity": "error",
      "resolved": true,
      "formats": [oas2],
      "given": ["$.paths.*", "$.x-ms-paths.*"],
      "then": {
        "function": hasApiVersionParameter,
        "functionOptions":{
          methods: ["get","put","patch","post","delete","trace"]
        }
      }
    }
  }
};

export default ruleset
