
export const ruleset = {
    configs:{

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
    rules: {
        "az-additional-properties-and-properties":{
            description: "Don't specify additionalProperties as a sibling of properties",
            severity: "warn",
            engineType: "spectral",
            formats: ['oas2', 'oas3'],
            given: "$..[?(@object() && @.type === 'object' && @.properties)]",
            then:{
                field: "additionalProperties",
                function: falsy
            }
        }

    }
}