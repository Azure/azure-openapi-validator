import { ruleSet as nativeArm } from "./native/rulesets/legacy" 
export const rulesets = {
    spectral:{
        "arm": {
            extends: "#common",
            rules:
                {
                "az-additional-properties-and-properties" : "warn"
                }
        },
        "dataplane":{
            extends: "#common",
        },
        common:{

        }
    },
    native: {
       "arm": nativeArm
    }
}