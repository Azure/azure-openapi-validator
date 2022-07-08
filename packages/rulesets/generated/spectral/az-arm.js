import { oas2 } from '@stoplight/spectral-formats';
import { truthy, falsy } from '@stoplight/spectral-functions';

const ruleset$1 = {
    extends: [],
    rules: {},
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
function diffSchema(a, b) {
    const notMatchedProperties = [];
    function diffSchemaInternal(a, b, paths) {
        if (!(a || b)) {
            return;
        }
        if (a && b) {
            const propsA = getProperties(a);
            const propsB = getProperties(b);
            Object.keys(propsA).forEach((p) => {
                if (propsB[p]) {
                    diffSchemaInternal(propsA[p], propsB[p], [...paths, p]);
                }
                else {
                    notMatchedProperties.push([...paths, p].join("."));
                }
            });
        }
    }
    diffSchemaInternal(a, b, []);
    return notMatchedProperties;
}
function getGetOperationSchema(paths, ctx) {
    var _a, _b, _c, _d;
    const getOperationPath = [...paths, "get"];
    const getOperation = jsonPath(getOperationPath, (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.document) === null || _a === void 0 ? void 0 : _a.parserResult) === null || _b === void 0 ? void 0 : _b.data);
    if (!getOperation) {
        return undefined;
    }
    return ((_c = getOperation === null || getOperation === void 0 ? void 0 : getOperation.responses["200"]) === null || _c === void 0 ? void 0 : _c.schema) || ((_d = getOperation === null || getOperation === void 0 ? void 0 : getOperation.responses["201"]) === null || _d === void 0 ? void 0 : _d.schema);
}

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

const consistentPatchProperties = (patchOp, _opts, ctx) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (patchOp === null || typeof patchOp !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const patchBodySchema = (_b = (_a = patchOp === null || patchOp === void 0 ? void 0 : patchOp.parameters) === null || _a === void 0 ? void 0 : _a.find((p) => p.in === "body")) === null || _b === void 0 ? void 0 : _b.schema;
    const patchBodySchemaIndex = (_c = patchOp === null || patchOp === void 0 ? void 0 : patchOp.parameters) === null || _c === void 0 ? void 0 : _c.findIndex((p) => p.in === "body");
    const responseSchema = ((_e = (_d = patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses) === null || _d === void 0 ? void 0 : _d["200"]) === null || _e === void 0 ? void 0 : _e.schema) || ((_g = (_f = patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses) === null || _f === void 0 ? void 0 : _f["201"]) === null || _g === void 0 ? void 0 : _g.schema) || getGetOperationSchema(path.slice(0, -1), ctx);
    if (patchBodySchema && responseSchema) {
        const absents = diffSchema(patchBodySchema, responseSchema);
        absents.forEach((absent) => {
            errors.push({
                message: `The property '${absent}' in the request body doesn't appear in the resource model.`,
                path: [...path, "parameters", patchBodySchemaIndex, "schema"],
            });
        });
    }
    return errors;
};

const validatePatchBodyParamProperties = (patchOp, _opts, ctx) => {
    var _a, _b, _c, _d, _e, _f;
    if (patchOp === null || typeof patchOp !== "object") {
        return [];
    }
    if (!_opts.should && !_opts.shouldNot) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const bodyParameter = (_b = (_a = patchOp === null || patchOp === void 0 ? void 0 : patchOp.parameters) === null || _a === void 0 ? void 0 : _a.find((p) => p.in === "body")) === null || _b === void 0 ? void 0 : _b.schema;
    if (bodyParameter) {
        const index = patchOp.parameters.findIndex((p) => p.in === "body");
        if (_opts.should) {
            const responseSchema = ((_d = (_c = patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses) === null || _c === void 0 ? void 0 : _c["200"]) === null || _d === void 0 ? void 0 : _d.schema) || ((_f = (_e = patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses) === null || _e === void 0 ? void 0 : _e["201"]) === null || _f === void 0 ? void 0 : _f.schema) || getGetOperationSchema(path.slice(0, -1), ctx);
            _opts.should.forEach((p) => {
                var _a, _b;
                if (!((_a = getProperties(bodyParameter)) === null || _a === void 0 ? void 0 : _a[p]) && ((_b = getProperties(responseSchema)) === null || _b === void 0 ? void 0 : _b[p])) {
                    errors.push({
                        message: `The patch operation body parameter schema should contains property '${p}'.`,
                        path: [...path, "parameters", index],
                    });
                }
            });
        }
        if (_opts.shouldNot) {
            _opts.shouldNot.forEach((p) => {
                var _a;
                if ((_a = getProperties(bodyParameter)) === null || _a === void 0 ? void 0 : _a[p]) {
                    errors.push({
                        message: `The patch operation body parameter schema should not contains property ${p}.`,
                        path: [...path, "parameters", index],
                    });
                }
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

const provisioningState = (swaggerObj, _opts, paths) => {
    const enumValue = swaggerObj.enum;
    if (swaggerObj === null || typeof swaggerObj !== "object" || enumValue === null || enumValue === undefined) {
        return [];
    }
    if (!Array.isArray(enumValue)) {
        return [];
    }
    const path = paths.path || [];
    const valuesMustHave = ["succeeded", "failed", "canceled"];
    if (enumValue && valuesMustHave.some((v) => !enumValue.some((ev) => ev.toLowerCase() === v))) {
        return [
            {
                message: "ProvisioningState must have terminal states: Succeeded, Failed and Canceled.",
                path,
            },
        ];
    }
    return [];
};

const hasHeader = (response, opts, paths) => {
    if (response === null || typeof response !== 'object') {
        return [];
    }
    if (opts === null || typeof opts !== 'object' || !opts.name) {
        return [];
    }
    const path = paths.path || [];
    const hasHeader = Object.keys(response.headers || {})
        .some((name) => name.toLowerCase() === opts.name.toLowerCase());
    if (!hasHeader) {
        return [
            {
                message: `Response should include an "${opts.name}" response header.`,
                path: [...path, 'headers'],
            },
        ];
    }
    return [];
};

const lroPatch202 = (patchOp, _opts, ctx) => {
    if (patchOp === null || typeof patchOp !== "object") {
        return [];
    }
    const path = ctx.path || [];
    if (!patchOp["x-ms-long-running-operation"]) {
        return [];
    }
    const errors = [];
    if ((patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses) && !(patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses["202"])) {
        errors.push({
            message: "The async patch operation should return 202.",
            path: [...path, "responses"],
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
        ConsistentPatchProperties: {
            description: "The properties in the patch body must be present in the resource model and follow json merge patch.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$.paths.*.patch"],
            then: {
                function: consistentPatchProperties,
            },
        },
        LroPatch202: {
            description: "Async PATCH should return 202.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[patch][?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
            then: {
                function: lroPatch202,
            },
        },
        DeleteResponseBodyEmpty: {
            description: "The delete response body must be empty.",
            message: "{{description}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[delete].responses.['200','204'].schema"],
            then: {
                function: falsy,
            },
        },
        GetOperation200: {
            description: "The get operation should only return 200.",
            message: "{{description}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[get].responses.['201','202','203','204']"],
            then: {
                function: falsy,
            },
        },
        ProvisioningStateValidation: {
            description: "ProvisioningState must have terminal states: Succeeded, Failed and Canceled.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$.definitions..provisioningState[?(@property === 'enum')]^"],
            then: {
                function: provisioningState,
            },
        },
        XmsLongRunningOperationOptions: {
            description: "The x-ms-long-running-operation-options should be specified explicitly to indicate the type of response header to track the async operation.",
            message: "{{description}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
            then: {
                field: "x-ms-long-running-operation-options",
                function: truthy,
            },
        },
        UnSupportedPatchProperties: {
            description: "Patch may not change the name, location, or type of the resource.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.patch"],
            then: {
                function: validatePatchBodyParamProperties,
                functionOptions: {
                    shouldNot: ["name", "type", "location"],
                },
            },
        },
        PatchSkuProperty: {
            description: "RP must implement PATCH for the 'SKU' envelope property if it's defined in the resource model.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.patch"],
            then: {
                function: validatePatchBodyParamProperties,
                functionOptions: {
                    should: ["sku"],
                },
            },
        },
        PatchIdentityProperty: {
            description: "RP must implement PATCH for the 'identity' envelope property If it's defined in the resource model.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.patch"],
            then: {
                function: validatePatchBodyParamProperties,
                functionOptions: {
                    should: ["identity"],
                },
            },
        },
        ArrayMustHaveType: {
            description: "Array type must have a type except for any type.",
            message: "{{error}}",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$.definitions..items[?(@object())]^"],
            then: {
                function: truthy,
                field: "type",
            },
        },
        LroLocationHeader: {
            description: "Location header must be supported for all async operations that return 202.",
            message: "A 202 response should include an Location response header.",
            severity: "warn",
            formats: [oas2],
            given: "$.paths[*][*].responses[?(@property == '202')]^",
            then: {
                function: hasHeader,
                functionOptions: {
                    name: "Location",
                },
            },
        },
        LroWithOriginalUriAsFinalState: {
            description: "The long running operation with final-state-via:original-uri should have a sibling 'get' operation.",
            message: "{{description}}",
            severity: "warn",
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
            severity: "warn",
            resolved: true,
            formats: [oas2],
            given: [
                "$[paths,'x-ms-paths'].*.post.x-ms-long-running-operation-options[?(@property === 'final-state-via' && @ === 'original-uri')]^",
            ],
            then: {
                function: falsy,
            },
        },
    },
};

export { ruleset as default };
