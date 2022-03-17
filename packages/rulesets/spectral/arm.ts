// @ts-nocheck
import {oas2, oas3} from "@stoplight/spectral-formats"
import {falsy} from "@stoplight/spectral-functions";
import {oas } from "@stoplight/spectral-rulesets"
import {default as patchcontenttype } from "./functions/patch-content-type";
export { ruleset as default };
const ruleset:any = {
  extends:[
    oas
  ],
  rules: {
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
    "az-patch-content-type": {
      "description": "The request body content type for patch operations should be JSON merge patch.",
      "message": "{{error}}",
      "severity": "warn",
      "formats": [oas2],
      "given": "$",
      "then": {
        "function": patchcontenttype
      }
    }
  }
};
