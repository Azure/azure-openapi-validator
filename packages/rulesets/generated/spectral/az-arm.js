import { oas2 } from '@stoplight/spectral-formats';
import { truthy, falsy, pattern } from '@stoplight/spectral-functions';
import { createRulesetFunction } from '@stoplight/spectral-core';

const ruleset$1 = {
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
                functionOptions: {
                    match: "https://docs.microsoft.com/\\w+\\-\\w+/azure/.*"
                }
            },
        }
    },
};

function matchAnyPatterns(patterns, path) {
    return patterns.some((p) => p.test(path));
}
function notMatchPatterns(patterns, path) {
    return patterns.every((p) => !p.test(path));
}
function verifyResourceGroup(path) {
    const lowerCasePath = path.toLowerCase();
    if (lowerCasePath.includes("/resourcegroups/") && !lowerCasePath.includes("/resourcegroups/{resourcegroupname}")) {
        return false;
    }
    return true;
}
function verifySubscriptionId(path) {
    const lowerCasePath = path.toLowerCase();
    if (lowerCasePath.includes("/subscriptions/") && !lowerCasePath.includes("/subscriptions/{subscriptionid}")) {
        return false;
    }
    return true;
}
function verifyResourceGroupScope(path) {
    const patterns = [
        /^\/subscriptions\/{subscriptionId}\/resourceGroups\/{resourceGroupName}\/providers\/.+/gi,
        /^\/?{\w+}\/resourceGroups\/{resourceGroupName}\/providers\/.+/gi,
        /^\/?{\w+}\/providers\/.+/gi,
    ];
    return matchAnyPatterns(patterns, path);
}
function verifyResourceType(path) {
    const patterns = [/^.*\/providers\/microsoft\.\w+\/\w+.*/gi];
    return matchAnyPatterns(patterns, path);
}
function verifyNestResourceType(path) {
    const patterns = [
        /^.*\/providers\/microsoft\.\w+\/\w+\/{\w+}(?:\/\w+\/(?!default)\w+){1,2}/gi,
        /^.*\/providers\/microsoft\.\w+(?:\/\w+\/(default|{\w+})){1,2}(?:\/\w+\/(?!default)\w+)+/gi,
        /^.*\/providers\/microsoft\.\w+\/\w+\/{\w+}(?:\/{\w+})+.*/gi,
    ];
    return notMatchPatterns(patterns, path);
}
const verifyArmPath = createRulesetFunction({
    input: null,
    options: {
        type: 'object',
        properties: {
            segmentToCheck: {
                oneOf: [
                    {
                        type: "string",
                        enum: ["resourceGroupParam", "subscriptionIdParam", "resourceType", "nestedResourceType", "resourceGroupScope"]
                    },
                    {
                        type: "array",
                        items: {
                            type: "string",
                            "enum": ["resourceGroupParam", "subscriptionIdParam", "resourceType", "nestedResourceType", "resourceGroupScope"]
                        }
                    }
                ]
            },
        },
        additionalProperties: false,
    },
}, (fullPath, _opts, paths) => {
    if (fullPath === null || typeof fullPath !== "string") {
        return [];
    }
    const path = paths.path || [];
    const errors = [];
    const optionsHandlers = {
        resourceType: (fullPath) => {
            if (!verifyResourceType(fullPath)) {
                errors.push({
                    message: `The path for the CURD methods do not contain a resource type.`,
                    path,
                });
            }
        },
        nestedResourceType: (fullPath) => {
            if (!verifyNestResourceType(fullPath)) {
                errors.push({
                    message: `The path for nested resource doest not meet the valid resource pattern.`,
                    path,
                });
            }
        },
        resourceGroupParam: (fullPath) => {
            if (!verifyResourceGroup(fullPath)) {
                errors.push({
                    message: `The path for resource group scoped CRUD methods does not contain a resourceGroupName parameter.`,
                    path,
                });
            }
        },
        subscriptionIdParam: (fullPath) => {
            if (!verifySubscriptionId(fullPath)) {
                errors.push({
                    message: `The path for the subscriptions scoped CRUD methods do not contain the subscriptionId parameter.`,
                    path,
                });
            }
        },
        resourceGroupScope: (fullPath) => {
            if (!verifyResourceGroupScope(fullPath)) {
                errors.push({
                    message: "",
                    path,
                });
            }
        },
    };
    const segments = typeof _opts.segmentToCheck === "string" ? [_opts.segmentToCheck] : _opts.segmentToCheck;
    segments.forEach((segment) => {
        optionsHandlers[segment](fullPath);
    });
    return errors;
});

function getProperties(schema) {
    if (!schema) {
        return {};
    }
    let properties = {};
    if (schema.allOf && Array.isArray(schema.allOf)) {
        schema.allOf.forEach((base) => {
            properties = { ...getProperties(base), ...properties };
        });
    }
    if (schema.properties) {
        properties = { ...properties, ...schema.properties };
    }
    return properties;
}
function getRequiredProperties(schema) {
    if (!schema) {
        return [];
    }
    let requires = [];
    if (schema.allOf && Array.isArray(schema.allOf)) {
        schema.allOf.forEach((base) => {
            requires = [...getRequiredProperties(base), ...requires];
        });
    }
    if (schema.required) {
        requires = [...schema.required, requires];
    }
    return requires;
}
function jsonPath(paths, root) {
    let result = undefined;
    paths.some((p) => {
        if (typeof root !== "object" && root !== null) {
            result = undefined;
            return true;
        }
        root = root[p];
        result = root;
        return false;
    });
    return result;
}

const bodyParamRepeatedInfo = (pathItem, _opts, paths) => {
    if (pathItem === null || typeof pathItem !== "object") {
        return [];
    }
    const path = paths.path || [];
    const errors = [];
    const pathParams = pathItem.parameters || [];
    if (pathItem["put"] && Array.isArray(pathItem["put"].parameters)) {
        const allParams = [...pathParams, ...pathItem["put"].parameters];
        const pathAndQueryParameters = allParams.filter((p) => p.in === "path" || p.in === "query").map((p) => p.name);
        const bodyParam = allParams.find((p) => p.in === "body");
        if (bodyParam) {
            const properties = getProperties(bodyParam.schema);
            if ("properties" in properties) {
                const propertiesProperties = getProperties(properties.properties);
                for (const prop of Object.keys(propertiesProperties)) {
                    if (pathAndQueryParameters.includes(prop)) {
                        errors.push({
                            message: `${prop}`,
                            path: [...path, "put", "parameters", pathItem["put"].parameters.findIndex((p) => p.name === prop)],
                        });
                    }
                }
            }
        }
    }
    return errors;
};

function checkApiVersion(param) {
    if (param.in !== "query") {
        return false;
    }
    return true;
}
const apiVersionName = "api-version";
const hasApiVersionParameter = (apiPath, opts, paths) => {
    var _a, _b;
    if (apiPath === null || typeof apiPath !== 'object') {
        return [];
    }
    if (opts === null || typeof opts !== 'object' || !opts.methods) {
        return [];
    }
    const path = paths.path || [];
    if (apiPath.parameters) {
        if (apiPath.parameters.some((p) => p.name === apiVersionName && checkApiVersion(p))) {
            return [];
        }
    }
    const messages = [];
    for (const method of Object.keys(apiPath)) {
        if (opts.methods.includes(method)) {
            const param = (_b = (_a = apiPath[method]) === null || _a === void 0 ? void 0 : _a.parameters) === null || _b === void 0 ? void 0 : _b.filter((p) => p.name === apiVersionName);
            if (!param || param.length === 0) {
                messages.push({
                    message: `Operation should include an 'api-version' parameter.`,
                    path: [...path, method]
                });
                continue;
            }
            if (!checkApiVersion(param[0])) {
                messages.push({
                    message: `Operation 'api-version' parameter should be a query parameter.`,
                    path: [...path, method]
                });
            }
        }
    }
    return messages;
};

const validateOriginalUri = (lroOptions, opts, ctx) => {
    if (!lroOptions || typeof lroOptions !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const messages = [];
    const getOperationPath = [...path.slice(0, -2), "get"];
    if (!jsonPath(getOperationPath, ctx.document.parserResult.data)) {
        messages.push({
            path: [...path.slice(0, -1)],
            message: "",
        });
    }
    return messages;
};

const pathBodyParameters = (parameters, _opts, paths) => {
    if (parameters === null || parameters.schema === undefined || parameters.in !== "body") {
        return [];
    }
    const path = paths.path || [];
    const properties = getProperties(parameters.schema);
    const requiredProperties = getRequiredProperties(parameters.schema);
    const errors = [];
    for (const prop of Object.keys(properties)) {
        if (properties[prop].default) {
            errors.push({
                message: `Properties of a PATCH request body must not have default value, property:${prop}.`,
                path: [...path, "schema"]
            });
        }
        if (requiredProperties.includes(prop)) {
            errors.push({
                message: `Properties of a PATCH request body must not be required, property:${prop}.`,
                path: [...path, "schema"]
            });
        }
        const xmsMutability = properties[prop]['x-ms-mutability'];
        if (xmsMutability && xmsMutability.length === 1 && xmsMutability[0] === "create") {
            errors.push({
                message: `Properties of a PATCH request body must not be x-ms-mutability: ["create"], property:${prop}.`,
                path: [...path, "schema"]
            });
        }
    }
    return errors;
};

const pathSegmentCasing = (apiPaths, _opts, paths) => {
    if (apiPaths === null || typeof apiPaths !== 'object') {
        return [];
    }
    if (!_opts || !_opts.segments || !Array.isArray(_opts.segments)) {
        return [];
    }
    const segments = _opts.segments;
    const path = paths.path || [];
    const errors = [];
    for (const apiPath of Object.keys(apiPaths)) {
        segments.forEach((seg) => {
            const idx = apiPath.toLowerCase().indexOf("/" + seg.toLowerCase());
            if (idx !== -1) {
                const originalSegment = apiPath.substring(idx + 1, idx + seg.length + 1);
                if (originalSegment !== seg) {
                    errors.push({
                        message: `The path segment ${originalSegment} should be ${seg}.`,
                        path: [...path, apiPath]
                    });
                }
            }
        });
    }
    return errors;
};

const ruleset = {
    extends: [ruleset$1],
    rules: {
        ApiHost: {
            description: "The host is required for management plane specs.",
            message: "{{description}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$.host"],
            then: {
                function: truthy,
            },
        },
        ApiVersionParameterRequired: {
            description: "All operations should have api-version query parameter.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$.paths.*", "$.x-ms-paths.*"],
            then: {
                function: hasApiVersionParameter,
                functionOptions: {
                    methods: ["get", "put", "patch", "post", "delete", "options", "head", "trace"],
                },
            },
        },
        SubscriptionsAndResourceGroupCasing: {
            description: "The subscriptions and resourceGroup in resource uri should follow lower camel case.",
            message: "{{error}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$.paths", "$.x-ms-paths"],
            then: {
                function: pathSegmentCasing,
                functionOptions: {
                    segments: ["resourceGroups", "subscriptions"],
                },
            },
        },
        PatchBodyParametersSchema: {
            description: "A request parameter of the Patch Operation must not have a required/default/'x-ms-mutability: [\"create\"]' value.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$.paths.*.patch.parameters[?(@.in === 'body')]"],
            then: {
                function: pathBodyParameters,
            },
        },
        ArrayMustHaveType: {
            description: "Array type must have a type except for any type.",
            message: "{{error}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$.definitions..items[?(@object())]^"],
            then: {
                function: truthy,
                field: "type",
            },
        },
        LroWithOriginalUriAsFinalState: {
            description: "The long running operation with final-state-via:original-uri should have a sibling 'get' operation.",
            message: "{{description}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: [
                "$[paths,'x-ms-paths'].*[put,patch,delete].x-ms-long-running-operation-options[?(@property === 'final-state-via' && @ === 'original-uri')]^",
            ],
            then: {
                function: validateOriginalUri,
            },
        },
        LroPostMustNotUseOriginalUriAsFinalState: {
            description: "The long running post operation must not use final-stat-via:original-uri.",
            message: "{{description}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: [
                "$[paths,'x-ms-paths'].*.post.x-ms-long-running-operation-options[?(@property === 'final-state-via' && @ === 'original-uri')]^",
            ],
            then: {
                function: falsy,
            },
        },
        PathContainsSubscriptionId: {
            description: "Path for resource group scoped CRUD methods MUST contain a subscriptionId parameter.",
            message: "{{error}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*[get,patch,put,delete]^~",
            then: {
                function: verifyArmPath,
                functionOptions: {
                    segmentToCheck: "subscriptionIdParam",
                },
            },
        },
        PathContainsResourceType: {
            description: "Path for resource CRUD methods MUST contain a resource type.",
            message: "{{error}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*[get,patch,put,delete]^~",
            then: {
                function: verifyArmPath,
                functionOptions: {
                    segmentToCheck: "resourceType",
                },
            },
        },
        PathContainsResourceGroup: {
            description: "Path for resource group scoped CRUD methods MUST contain a resourceGroupName parameter.",
            message: "{{error}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[get,patch,put,delete]^~"],
            then: {
                function: verifyArmPath,
                functionOptions: {
                    segmentToCheck: "resourceGroupParam",
                },
            },
        },
        PathForPutOperation: {
            description: "The path for 'put' operation must be under a subscription and resource group.",
            message: "{{description}}",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*[put]^~",
            then: {
                function: verifyArmPath,
                functionOptions: {
                    segmentToCheck: "resourceGroupScope",
                },
            },
        },
        PathForNestedResource: {
            description: "Path for CRUD methods on a nested resource type MUST follow valid resource naming.",
            message: "{{error}}",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*[get,patch,delete,put]^~",
            then: {
                function: verifyArmPath,
                functionOptions: {
                    segmentToCheck: "nestedResourceType",
                },
            },
        },
        PathForResourceAction: {
            description: "Path for 'post' method on a resource type MUST follow valid resource naming.",
            message: "{{description}}",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*.post^~",
            then: {
                function: pattern,
                functionOptions: {
                    match: ".*/providers/[\\w\\.]+(?:/\\w+/(default|{\\w+}))*/\\w+$",
                },
            },
        },
        RepeatedPathInfo: {
            description: "Information in the Path should not be repeated in the request body (i.e. subscription ID, resource group name, resource name).",
            message: "The '{{error}}' already appears in the path, please don't repeat it in the request body.",
            severity: "warn",
            resolved: true,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*.put^",
            then: {
                function: bodyParamRepeatedInfo,
            },
        },
    },
};

export { ruleset as default };
