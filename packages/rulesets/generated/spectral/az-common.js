import { falsy } from '@stoplight/spectral-functions';

const ruleset = {
    extends: [],
    rules: {
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
};

export { ruleset as default };
