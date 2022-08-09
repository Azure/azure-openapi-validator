import { oas2 } from '@stoplight/spectral-formats';
import { truthy, falsy, pattern } from '@stoplight/spectral-functions';
import { createRulesetFunction } from '@stoplight/spectral-core';

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
        properties = { properties, ...schema.properties };
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

const avoidAnonymousParameter = (parameters, _opts, paths) => {
    if (parameters === null || parameters.schema === undefined || parameters["x-ms-client-name"] !== undefined) {
        return [];
    }
    const path = paths.path || [];
    const properties = parameters.schema.properties;
    if ((properties === undefined || Object.keys(properties).length === 0) &&
        parameters.schema.additionalProperties === undefined &&
        parameters.schema.allOf === undefined) {
        return [];
    }
    return [{
            message: 'Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.',
            path,
        }];
};

const consistentresponsebody = (pathItem, _opts, paths) => {
    if (pathItem === null || typeof pathItem !== 'object') {
        return [];
    }
    const path = paths.path || [];
    const errors = [];
    const createResponseSchema = ((op) => { var _a, _b; return (_b = (_a = op === null || op === void 0 ? void 0 : op.responses) === null || _a === void 0 ? void 0 : _a['201']) === null || _b === void 0 ? void 0 : _b.schema; });
    const resourceSchema = createResponseSchema(pathItem.put) || createResponseSchema(pathItem.patch);
    if (resourceSchema) {
        ['put', 'get', 'patch'].forEach((method) => {
            var _a, _b, _c;
            const responseSchema = (_c = (_b = (_a = pathItem[method]) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b['200']) === null || _c === void 0 ? void 0 : _c.schema;
            if (responseSchema && responseSchema !== resourceSchema) {
                errors.push({
                    message: 'Response body schema does not match create response body schema.',
                    path: [...path, method, 'responses', '200', 'schema'],
                });
            }
        });
    }
    return errors;
};

const defaultInEnum = (swaggerObj, _opts, paths) => {
    const defaultValue = swaggerObj.default;
    const enumValue = swaggerObj.enum;
    if (swaggerObj === null ||
        typeof swaggerObj !== 'object' ||
        defaultValue === null ||
        defaultValue === undefined ||
        enumValue === null ||
        enumValue === undefined) {
        return [];
    }
    if (!Array.isArray(enumValue)) {
        return [];
    }
    const path = paths.path || [];
    if (enumValue && !enumValue.includes(defaultValue)) {
        return [{
                message: 'Default value should appear in the enum constraint for a schema.',
                path,
            }];
    }
    return [];
};

const delete204Response = (deleteResponses, _opts, paths) => {
    if (deleteResponses === null || typeof deleteResponses !== 'object') {
        return [];
    }
    const path = paths.path || [];
    if (!deleteResponses['204'] && !deleteResponses['202']) {
        return [{
                message: 'A delete operation should have a 204 response.',
                path,
            }];
    }
    return [];
};

const enumInsteadOfBoolean = (swaggerObj, _opts, paths) => {
    if (swaggerObj === null) {
        return [];
    }
    const path = paths.path || [];
    return [{
            message: 'Booleans properties are not descriptive in all cases and can make them to use, evaluate whether is makes sense to keep the property as boolean or turn it into an enum.',
            path,
        }];
};

function isArraySchema(schema) {
    return schema.type === 'array' || !!schema.items;
}
function isObjectSchema(schema) {
    return schema.type === 'object' || !!schema.properties || schema.$ref;
}
function validateErrorResponseSchema(errorResponseSchema, pathToSchema) {
    var _a, _b;
    const errors = [];
    if (!errorResponseSchema.properties) {
        errors.push({
            message: 'Error response schema must be an object schema.',
            path: pathToSchema,
        });
        return errors;
    }
    if (!errorResponseSchema.properties.error || !errorResponseSchema.properties.error.properties) {
        errors.push({
            message: 'Error response schema should contain an object property named `error`.',
            path: [...pathToSchema, 'properties', 'error'],
        });
        return errors;
    }
    if (!((_b = (_a = errorResponseSchema.required) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, 'error'))) {
        errors.push({
            message: 'The `error` property in the error response schema should be required.',
            path: [...pathToSchema, 'required'],
        });
    }
    const errorSchema = errorResponseSchema.properties.error;
    const pathToErrorSchema = [...pathToSchema, 'properties', 'error'];
    const hasCode = !!errorSchema.properties.code;
    const hasMessage = !!errorSchema.properties.message;
    if (!hasCode && hasMessage) {
        errors.push({
            message: 'Error schema should contain `code` property.',
            path: [...pathToErrorSchema, 'properties'],
        });
    }
    return messages;
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

const validateOriginalUri = (lroOptions, opts, ctx) => {
    if (!lroOptions || typeof lroOptions !== "object") {
        return [];
    }
    const path = paths.path || [];
    const errors = [];
    if (!operation.operationId) {
        return errors;
    }
    const m = operation.operationId.match(/[A-Za-z0-9]+_([A-Za-z0-9]+)/);
    if (!m) {
        errors.push({
            message: 'OperationId should be of the form "Noun_Verb"',
            path: [...path, 'operationId'],
        });
    }
    const verb = m ? m[1] : operation.operationId;
    const method = path[path.length - 1];
    const isCreate = ['put', 'patch'].includes(method) && ((_a = operation.responses) === null || _a === void 0 ? void 0 : _a['201']);
    const isUpdate = ['put', 'patch'].includes(method) && ((_b = operation.responses) === null || _b === void 0 ? void 0 : _b['200']);
    if (isCreate && isUpdate) {
        if (!verb.match(/create/i) || !verb.match(/update/i)) {
            errors.push({
                message: `OperationId for ${method} method should contain both "Create" and "Update"`,
                path: [...path, 'operationId'],
            });
        }
    }
    else {
        const isList = method === 'get' && operation['x-ms-pageable'];
        const patterns = {
            get: isList ? /list/i : /(get|list)/i,
            put: isCreate ? /create/i : /(create|update)/i,
            patch: /update/i,
            delete: /delete/i,
        };
        const frags = {
            get: isList ? '"List"' : '"Get" or "list"',
            put: isCreate ? '"Create"' : '"Create" or "Update"',
            patch: '"Update"',
            delete: '"Delete"',
        };
        if (patterns[method] && !verb.match(patterns[method])) {
            if (isList) {
                errors.push({
                    message: 'OperationId for get method on a collection should contain "List"',
                    path: [...path, 'operationId'],
                });
            }
            else {
                errors.push({
                    message: `OperationId for ${method} method should contain ${frags[method]}`,
                    path: [...path, 'operationId'],
                });
            }
        }
    }
    return errors;
};

const paginationResponse = (operation, _opts, paths) => {
    var _a, _b;
    if (operation === null || typeof operation !== 'object') {
        return [];
    }
    const path = paths.path || [];
    if (!operation.responses || typeof operation.responses !== 'object') {
        return [];
    }
    const resp = Object.keys(operation.responses)
        .find((code) => code.startsWith('2'));
    if (!resp) {
        return [];
    }
    const responseSchema = operation.responses[resp].schema || {};
    const errors = [];
    if (operation['x-ms-pageable']) {
        if (responseSchema.properties && 'value' in responseSchema.properties) {
            if (responseSchema.properties.value.type !== 'array') {
                errors.push({
                    message: '`value` property in pageable response should be type: array',
                    path: [...path, 'responses', resp, 'schema', 'properties', 'value', 'type'],
                });
            }
            if (!((_a = responseSchema.required) === null || _a === void 0 ? void 0 : _a.includes('value'))) {
                errors.push({
                    message: '`value` property in pageable response should be required',
                    path: [...path, 'responses', resp, 'schema', 'required'],
                });
            }
        }
        else if (!responseSchema.allOf) {
            errors.push({
                message: 'Response body schema of pageable response should contain top-level array property `value`',
                path: [...path, 'responses', resp, 'schema', 'properties'],
            });
        }
        const nextLinkName = operation['x-ms-pageable'].nextLinkName || 'nextLink';
        if (responseSchema.properties && nextLinkName in responseSchema.properties) {
            if (responseSchema.properties[nextLinkName].type !== 'string') {
                errors.push({
                    message: `\`${nextLinkName}\` property in pageable response should be type: string`,
                    path: [...path, 'responses', resp, 'schema', 'properties', nextLinkName, 'type'],
                });
            }
            if ((_b = responseSchema.required) === null || _b === void 0 ? void 0 : _b.includes(nextLinkName)) {
                errors.push({
                    message: `\`${nextLinkName}\` property in pageable response should be optional.`,
                    path: [...path, 'responses', resp, 'schema', 'required'],
                });
            }
        }
        else if (!responseSchema.allOf) {
            errors.push({
                message: `Response body schema of pageable response should contain top-level property \`${nextLinkName}\``,
                path: [...path, 'responses', resp, 'schema', 'properties'],
            });
        }
    }
    else {
        const responseHasArray = Object.values(responseSchema.properties || {})
            .some((prop) => (prop === null || prop === void 0 ? void 0 : prop.type) === 'array');
        if (responseHasArray && Object.keys(responseSchema.properties).length <= 3) {
            errors.push({
                message: 'Operation might be pageable. Consider adding the x-ms-pageable extension.',
                path,
            });
        }
    }
    return errors;
};

const paramNames = (targetVal, _opts, paths) => {
    if (targetVal === null || typeof targetVal !== 'object') {
        return [];
    }
    const path = paths.path || [];
    if (!targetVal.in || !targetVal.name) {
        return [];
    }
    if (targetVal.name.match(/^[$@]/)) {
        return [
            {
                message: `Parameter name "${targetVal.name}" should not begin with '$' or '@'.`,
                path: [...path, 'name'],
            },
        ];
    }
    if (['path', 'query'].includes(targetVal.in) && targetVal.name !== 'api-version') {
        if (!targetVal.name.match(/^[a-z][a-z0-9]*([A-Z][a-z0-9]+)*$/)) {
            return [
                {
                    message: `Parameter name "${targetVal.name}" should be camel case.`,
                    path: [...path, 'name'],
                },
            ];
        }
    }
    else if (targetVal.in === 'header') {
        if (!targetVal.name.match(/^[A-Za-z][a-z0-9]*(-[A-Za-z][a-z0-9]*)*$/)) {
            return [
                {
                    message: `header parameter name "${targetVal.name}" should be kebab case.`,
                    path: [...path, 'name'],
                },
            ];
        }
    }
    return [];
};

function canonical(name) {
    return typeof (name) === 'string' ? name.toLowerCase() : name;
}
function dupIgnoreCase(arr) {
    if (!Array.isArray(arr)) {
        return [];
    }
    const isDup = (value, index, self) => self.indexOf(value) !== index;
    return [...new Set(arr.map((v) => canonical(v)).filter(isDup))];
}
const paramNamesUnique = (pathItem, _opts, paths) => {
    if (pathItem === null || typeof pathItem !== 'object') {
        return [];
    }
    const path = paths.path || [];
    const errors = [];
    const pathParams = pathItem.parameters ? pathItem.parameters.map((p) => p.name) : [];
    const pathDups = dupIgnoreCase(pathParams);
    pathDups.forEach((dup) => {
        const dupKeys = [...pathParams.keys()].filter((k) => canonical(pathParams[k]) === dup);
        const first = `parameters.${dupKeys[0]}`;
        dupKeys.slice(1).forEach((key) => {
            errors.push({
                message: `Duplicate parameter name (ignoring case) with ${first}.`,
                path: [...path, 'parameters', key, 'name'],
            });
        });
    });
    ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].forEach((method) => {
        if (pathItem[method] && Array.isArray(pathItem[method].parameters)) {
            const allParams = [...pathParams, ...pathItem[method].parameters.map((p) => p.name)];
            const dups = dupIgnoreCase(allParams);
            dups.forEach((dup) => {
                const dupKeys = [...allParams.keys()].filter((k) => canonical(allParams[k]) === dup);
                const first = dupKeys[0] < pathParams.length ? `parameters.${dupKeys[0]}`
                    : `${method}.parameters.${dupKeys[0] - pathParams.length}`;
                dupKeys.slice(1).filter((k) => k >= pathParams.length).forEach((key) => {
                    errors.push({
                        message: `Duplicate parameter name (ignoring case) with ${first}.`,
                        path: [...path, method, 'parameters', key - pathParams.length, 'name'],
                    });
                });
            });
        }
    });
    return errors;
};

const paramOrder = (paths) => {
    var _a, _b, _c;
    if (paths === null || typeof paths !== 'object') {
        return [];
    }
    const inPath = (p) => p.in === 'path';
    const paramName = (p) => p.name;
    const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
    const errors = [];
    for (const pathKey of Object.keys(paths)) {
        const paramsInPath = (_a = pathKey.match(/[^{}]+(?=})/g)) !== null && _a !== void 0 ? _a : [];
        if (paramsInPath.length > 0) {
            const pathItem = paths[pathKey];
            const pathItemPathParams = (_c = (_b = pathItem.parameters) === null || _b === void 0 ? void 0 : _b.filter(inPath).map(paramName)) !== null && _c !== void 0 ? _c : [];
            const indx = pathItemPathParams.findIndex((v, i) => v !== paramsInPath[i]);
            if (indx >= 0 && indx < paramsInPath.length) {
                errors.push({
                    message: `Path parameter "${paramsInPath[indx]}" should appear before "${pathItemPathParams[indx]}".`,
                    path: ['paths', pathKey, 'parameters'],
                });
            }
            else {
                const offset = pathItemPathParams.length;
                methods.filter((m) => pathItem[m]).forEach((method) => {
                    var _a, _b;
                    const opPathParams = (_b = (_a = pathItem[method].parameters) === null || _a === void 0 ? void 0 : _a.filter(inPath).map(paramName)) !== null && _b !== void 0 ? _b : [];
                    const indx2 = opPathParams.findIndex((v, i) => v !== paramsInPath[offset + i]);
                    if (indx2 >= 0 && (offset + indx2) < paramsInPath.length) {
                        errors.push({
                            message: `Path parameter "${paramsInPath[offset + indx2]}" should appear before "${opPathParams[indx2]}".`,
                            path: ['paths', pathKey, method, 'parameters'],
                        });
                    }
                });
            }
        }
    }
    return messages;
};

const MERGE_PATCH = 'application/merge-patch+json';
function checkOperationConsumes(targetVal) {
    const { paths } = targetVal;
    const errors = [];
    if (paths && typeof paths === 'object') {
        Object.keys(paths).forEach((path) => {
            ['post', 'put'].forEach((method) => {
                if (paths[path][method]) {
                    const { consumes } = paths[path][method];
                    if (consumes === null || consumes === void 0 ? void 0 : consumes.includes(MERGE_PATCH)) {
                        errors.push({
                            message: `A ${method} operation should not consume 'application/merge-patch+json' content type.`,
                            path: ['paths', path, method, 'consumes'],
                        });
                    }
                }
            });
            if (paths[path].patch) {
                const { consumes } = paths[path].patch;
                if (!consumes || !consumes.includes(MERGE_PATCH)) {
                    errors.push({
                        message: "A patch operation should consume 'application/merge-patch+json' content type.",
                        path: ['paths', path, 'patch', ...(consumes ? ['consumes'] : [])],
                    });
                }
                else if (consumes.length > 1) {
                    errors.push({
                        message: "A patch operation should only consume 'application/merge-patch+json' content type.",
                        path: ['paths', path, 'patch', 'consumes'],
                    });
                }
            }
        });
    }
    return errors;
}
const patchContentYype = (targetVal) => {
    var _a;
    if (targetVal === null || typeof targetVal !== 'object') {
        return [];
    }
    const errors = [];
    if ((_a = targetVal.consumes) === null || _a === void 0 ? void 0 : _a.includes(MERGE_PATCH)) {
        errors.push({
            message: 'Global consumes should not specify `application/merge-patch+json` content type.',
            path: ['consumes'],
        });
    }
    errors.push(...checkOperationConsumes(targetVal));
    return errors;
};

const pathParamNames = (paths) => {
    if (paths === null || typeof paths !== 'object') {
        return [];
    }
    const errors = [];
    const paramNameForSegment = {};
    for (const pathKey of Object.keys(paths)) {
        const parts = pathKey.split('/').slice(1);
        parts.slice(1).forEach((v, i) => {
            var _a;
            if (v.includes('}')) {
                const param = (_a = v.match(/[^{}]+(?=})/)) === null || _a === void 0 ? void 0 : _a[0];
                const p = parts[i];
                if (paramNameForSegment[p]) {
                    if (paramNameForSegment[p] !== param) {
                        errors.push({
                            message: `Inconsistent path parameter names "${param}" and "${paramNameForSegment[p]}".`,
                            path: ['paths', pathKey],
                        });
                    }
                }
                else {
                    paramNameForSegment[p] = param;
                }
            }
        });
    }
    return errors;
};

const URL_MAX_LENGTH = 2083;
const pathParamSchema = (param, _opts, paths) => {
    if (param === null || typeof param !== 'object') {
        return [];
    }
    const path = paths.path || [];
    if (!param.in || !param.name) {
        return [];
    }
    const errors = [];
    const isOas3 = !!param.schema;
    const schema = isOas3 ? param.schema : param;
    if (isOas3) {
        path.push('schema');
    }
    if (schema.type !== 'string') {
        errors.push({
            message: 'Path parameter should be defined as type: string.',
            path: [...path, 'type'],
        });
    }
    if (!schema.maxLength && !schema.pattern) {
        errors.push({
            message: 'Path parameter should specify a maximum length (maxLength) and characters allowed (pattern).',
            path,
        });
    }
    else if (!schema.maxLength) {
        errors.push({
            message: 'Path parameter should specify a maximum length (maxLength).',
            path,
        });
    }
    else if (schema.maxLength && schema.maxLength >= URL_MAX_LENGTH) {
        errors.push({
            message: `Path parameter maximum length should be less than ${URL_MAX_LENGTH}`,
            path,
        });
    }
    else if (!schema.pattern) {
        errors.push({
            message: 'Path parameter should specify characters allowed (pattern).',
            path,
        });
    }
    return errors;
};

function getVersion(path) {
    const url = new URL(path, 'https://foo.bar');
    const segments = url.pathname.split('/');
    return segments.find((segment) => segment.match(/v[0-9]+(.[0-9]+)?/));
}
function checkPaths(targetVal) {
    const oas2 = targetVal.swagger;
    if (oas2) {
        const basePath = targetVal.basePath || '';
        const version = getVersion(basePath);
        if (version) {
            return [
                {
                    message: `Version segment "${version}" in basePath violates Azure versioning policy.`,
                    path: ['basePath'],
                },
            ];
        }
    }
    const { paths } = targetVal;
    const errors = [];
    if (paths && typeof paths === 'object') {
        Object.keys(paths).forEach((path) => {
            const version = getVersion(path);
            if (version) {
                errors.push({
                    message: `Version segment "${version}" in path violates Azure versioning policy.`,
                    path: ['paths', path],
                });
            }
        });
    }
    return errors;
}
function findVersionParam(params) {
    const isApiVersion = (elem) => elem.name === 'api-version' && elem.in === 'query';
    if (params && Array.isArray(params)) {
        return params.filter(isApiVersion).shift();
    }
    return undefined;
}
function validateVersionParam(param, path) {
    const errors = [];
    if (!param.required) {
        errors.push({
            message: '"api-version" should be a required parameter',
            path,
        });
    }
    return errors;
}
function checkVersionParam(targetVal) {
    const { paths } = targetVal;
    const errors = [];
    if (paths && typeof paths === 'object') {
        Object.keys(paths).forEach((path) => {
            if (paths[path].parameters && Array.isArray(paths[path].parameters)) {
                const versionParam = findVersionParam(paths[path].parameters);
                if (versionParam) {
                    const index = paths[path].parameters.indexOf(versionParam);
                    errors.push(...validateVersionParam(versionParam, ['paths', path, 'parameters', index.toString()]));
                    return;
                }
            }
            ['get', 'post', 'put', 'patch', 'delete'].forEach((method) => {
                if (paths[path][method]) {
                    const versionParam = findVersionParam(paths[path][method].parameters);
                    if (versionParam) {
                        const index = paths[path][method].parameters.indexOf(versionParam);
                        errors.push(...validateVersionParam(versionParam, ['paths', path, method, 'parameters', index]));
                    }
                    else {
                        errors.push({
                            message: 'Operation does not define an "api-version" query parameter.',
                            path: ['paths', path, method, 'parameters'],
                        });
                    }
                }
            });
        });
    }
    return errors;
}
const versionPolicy = (targetVal) => {
    if (targetVal === null || typeof targetVal !== 'object') {
        return [];
    }
    const errors = checkPaths(targetVal);
    errors.push(...checkVersionParam(targetVal));
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
                function: consistentresponsebody,
            },
        },
        "az-default-response": {
            description: "All operations should have a default (error) response.",
            message: "Operation is missing a default response.",
            severity: "warn",
            given: "$.paths.*.*.responses",
            then: {
                field: "default",
                function: truthy,
            },
        },
        "az-delete-204-response": {
            description: "A delete operation should have a 204 response.",
            message: "A delete operation should have a `204` response.",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$.paths[*].delete.responses",
            then: {
                function: delete204Response,
            },
        },
        "az-error-response": {
            description: "Error response body should conform to Microsoft Azure API Guidelines.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2],
            given: "$.paths[*][*].responses",
            then: {
                function: errorResponse,
            },
        },
        "az-formdata": {
            description: "Check for appropriate use of formData parameters.",
            severity: "info",
            formats: [oas2],
            given: '$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.in == "formData")]',
            then: {
                function: falsy,
            },
        },
        "az-header-disallowed": {
            description: "Authorization, Content-type, and Accept headers should not be defined explicitly.",
            message: 'Header parameter "{{value}}" should not be defined explicitly.',
            severity: "warn",
            formats: [oas2, oas3],
            given: [
                "$.paths[*].parameters.[?(@.in == 'header')]",
                "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.in == 'header')]",
            ],
            then: {
                function: pattern,
                field: "name",
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
            given: "$.paths[*][*].responses[?(@property == '202')]",
            then: {
                function: hasHeader,
                functionOptions: {
                    name: "Operation-location",
                },
            },
        },
        "az-ms-paths": {
            description: "Don't use x-ms-paths except where necessary to support legacy APIs.",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$.x-ms-paths",
            then: {
                function: falsy,
            },
        },
        "az-nullable": {
            description: "Avoid the use of x-nullable.",
            severity: "warn",
            formats: [oas2, oas3],
            resolved: false,
            given: "$..x-nullable",
            then: {
                function: undefined$1,
            },
        },
        "az-operation-id": {
            description: "OperationId should conform to Azure API Guidelines",
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
            severity: "error",
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
                field: "schema",
                function: truthy,
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
                function: spectralFunctions.falsy,
            },
        },
    },
};

export { ruleset as default };
