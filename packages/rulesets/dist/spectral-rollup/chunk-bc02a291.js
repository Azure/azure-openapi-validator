'use strict';

var require$$0 = require('@stoplight/spectral-formats');
var require$$1 = require('@stoplight/spectral-functions');
var require$$2 = require('@stoplight/spectral-rulesets');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);

var consistentResponseBody = {};

Object.defineProperty(consistentResponseBody, "__esModule", { value: true });
const consistentresponsebody = (pathItem, _opts, paths) => {
    if (pathItem === null || typeof pathItem !== 'object') {
        return [];
    }
    const path = paths.path || paths.target || [];
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
consistentResponseBody.default = consistentresponsebody;

var delete204Response$1 = {};

Object.defineProperty(delete204Response$1, "__esModule", { value: true });
const delete204Response = (deleteResponses, _opts, paths) => {
    if (deleteResponses === null || typeof deleteResponses !== 'object') {
        return [];
    }
    const path = paths.path || paths.target || [];
    if (!deleteResponses['204'] && !deleteResponses['202']) {
        return [{
                message: 'A delete operation should have a 204 response.',
                path,
            }];
    }
    return [];
};
delete204Response$1.default = delete204Response;

var errorResponse$1 = {};

Object.defineProperty(errorResponse$1, "__esModule", { value: true });
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
    else if (hasCode && !hasMessage) {
        errors.push({
            message: 'Error schema should contain `message` property.',
            path: [...pathToErrorSchema, 'properties'],
        });
    }
    else if (!hasCode && !hasMessage) {
        errors.push({
            message: 'Error schema should contain `code` and `message` properties.',
            path: [...pathToErrorSchema, 'properties'],
        });
    }
    if (hasCode && errorSchema.properties.code.type !== 'string') {
        errors.push({
            message: 'The `code` property of error schema should be type `string`.',
            path: [...pathToErrorSchema, 'properties', 'code', 'type'],
        });
    }
    if (hasMessage && errorSchema.properties.message.type !== 'string') {
        errors.push({
            message: 'The `message` property of error schema should be type `string`.',
            path: [...pathToErrorSchema, 'properties', 'message', 'type'],
        });
    }
    if (['code', 'message'].every((prop) => { var _a, _b; return !((_b = (_a = errorSchema.required) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, prop)); })) {
        errors.push({
            message: 'Error schema should define `code` and `message` properties as required.',
            path: [...pathToErrorSchema, 'required'],
        });
    }
    else if (!errorSchema.required.includes('code')) {
        errors.push({
            message: 'Error schema should define `code` property as required.',
            path: [...pathToErrorSchema, 'required'],
        });
    }
    else if (!errorSchema.required.includes('message')) {
        errors.push({
            message: 'Error schema should define `message` property as required.',
            path: [...pathToErrorSchema, 'required'],
        });
    }
    if (!!errorSchema.properties.target && errorSchema.properties.target.type !== 'string') {
        errors.push({
            message: 'The `target` property of the error schema should be type `string`.',
            path: [...pathToErrorSchema, 'properties', 'target'],
        });
    }
    if (!!errorSchema.properties.details && !isArraySchema(errorSchema.properties.details)) {
        errors.push({
            message: 'The `details` property of the error schema should be an array.',
            path: [...pathToErrorSchema, 'properties', 'details'],
        });
    }
    if (!!errorSchema.properties.innererror && !isObjectSchema(errorSchema.properties.innererror)) {
        errors.push({
            message: 'The `innererror` property of the error schema should be an object.',
            path: [...pathToErrorSchema, 'properties', 'innererror'],
        });
    }
    return errors;
}
function validateErrorResponse(errorResponse, responsePath) {
    const errors = [];
    if (!errorResponse.schema) {
        errors.push({
            message: 'Error response should have a schema.',
            path: responsePath,
        });
    }
    else {
        errors.push(...validateErrorResponseSchema(errorResponse.schema, [...responsePath, 'schema']));
    }
    if (!errorResponse.headers || !errorResponse.headers['x-ms-error-code']) {
        errors.push({
            message: 'Error response should contain a x-ms-error-code header.',
            path: !errorResponse.headers ? responsePath : [...responsePath, 'headers'],
        });
    }
    return errors;
}
function errorResponse(responses, _opts, paths) {
    const errors = [];
    const path = paths.path || paths.target || [];
    if (responses.default) {
        errors.push(...validateErrorResponse(responses.default, [...path, 'default']));
    }
    Object.keys(responses).filter((code) => code.match(/[45]\d\d/)).forEach((code) => {
        errors.push(...validateErrorResponse(responses[code], [...path, code]));
        if (!(responses[code]['x-ms-error-response'])) {
            errors.push({
                message: 'Error response should contain x-ms-error-response.',
                path: [...path, code],
            });
        }
    });
    return errors;
}
errorResponse$1.default = errorResponse;

var hasHeader$1 = {};

Object.defineProperty(hasHeader$1, "__esModule", { value: true });
const hasHeader = (response, opts, paths) => {
    if (response === null || typeof response !== 'object') {
        return [];
    }
    if (opts === null || typeof opts !== 'object' || !opts.name) {
        return [];
    }
    const path = paths.path || paths.target || [];
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
hasHeader$1.default = hasHeader;

var operationId$1 = {};

Object.defineProperty(operationId$1, "__esModule", { value: true });
const operationId = (operation, _opts, paths) => {
    var _a, _b;
    if (operation === null || typeof operation !== 'object') {
        return [];
    }
    const path = paths.path || paths.target || [];
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
operationId$1.default = operationId;

var paginationResponse$1 = {};

Object.defineProperty(paginationResponse$1, "__esModule", { value: true });
const paginationResponse = (operation, _opts, paths) => {
    var _a, _b;
    if (operation === null || typeof operation !== 'object') {
        return [];
    }
    const path = paths.path || paths.target || [];
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
paginationResponse$1.default = paginationResponse;

var paramNamesUnique$1 = {};

Object.defineProperty(paramNamesUnique$1, "__esModule", { value: true });
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
    const path = paths.path || paths.target || [];
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
paramNamesUnique$1.default = paramNamesUnique;

var paramNames = {};

(function (exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramNames = void 0;
const paramNames = (targetVal, _opts, paths) => {
    if (targetVal === null || typeof targetVal !== 'object') {
        return [];
    }
    const path = paths.path || paths.target || [];
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
exports.paramNames = paramNames;
exports.default = exports.paramNames;

}(paramNames));

var paramOrder = {};

(function (exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramOrder = void 0;
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
    return errors;
};
exports.paramOrder = paramOrder;
exports.default = exports.paramOrder;

}(paramOrder));

var patchContentType = {};

(function (exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchContentYype = void 0;
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
exports.patchContentYype = patchContentYype;
exports.default = exports.patchContentYype;

}(patchContentType));

var pathParamNames = {};

(function (exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathParamNames = void 0;
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
exports.pathParamNames = pathParamNames;
exports.default = exports.pathParamNames;

}(pathParamNames));

var pathParamSchema = {};

(function (exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathParamSchema = void 0;
const URL_MAX_LENGTH = 2083;
const pathParamSchema = (param, _opts, paths) => {
    if (param === null || typeof param !== 'object') {
        return [];
    }
    const path = paths.path || paths.target || [];
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
exports.pathParamSchema = pathParamSchema;
exports.default = exports.pathParamSchema;

}(pathParamSchema));

var versionPolicy = {};

(function (exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionPolicy = void 0;
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
exports.versionPolicy = versionPolicy;
exports.default = exports.versionPolicy;

}(versionPolicy));

const spectral_formats_1 = require$$0__default["default"];
const spectral_functions_1 = require$$1__default["default"];
const spectral_rulesets_1 = require$$2__default["default"];
const consistent_response_body_1 = __importDefault(consistentResponseBody);
const delete_204_response_1 = __importDefault(delete204Response$1);
const error_response_1 = __importDefault(errorResponse$1);
const has_header_1 = __importDefault(hasHeader$1);
const operation_id_1 = __importDefault(operationId$1);
const pagination_response_1 = __importDefault(paginationResponse$1);
const param_names_unique_1 = __importDefault(paramNamesUnique$1);
const param_names_1 = __importDefault(paramNames);
const param_order_1 = __importDefault(paramOrder);
const patch_content_type_1 = __importDefault(patchContentType);
const path_param_names_1 = __importDefault(pathParamNames);
const path_param_schema_1 = __importDefault(pathParamSchema);
const version_policy_1 = __importDefault(versionPolicy);
const ruleset$1 = {
    extends: [
        spectral_rulesets_1.oas
    ],
    rules: {
        "info-contact": "off",
        "no-$ref-siblings": "off",
        "az-additional-properties-and-properties": {
            "description": "Don't specify additionalProperties as a sibling of properties.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$..[?(@object() && @.type === 'object' && @.properties)]",
            "then": {
                "field": "additionalProperties",
                "function": spectral_functions_1.falsy
            }
        },
        "az-additional-properties-object": {
            "description": "additionalProperties with type object is a common error.",
            "severity": "info",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "resolved": false,
            "given": "$..[?(@property == 'additionalProperties' && @.type == 'object' && @.properties == undefined)]",
            "then": {
                "function": spectral_functions_1.falsy
            }
        },
        "az-api-version-enum": {
            "description": "The api-version parameter should not be an enum.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": ["$.paths[*].parameters.[?(@.name == 'api-version')]", "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.name == 'api-version')]"],
            "then": {
                "field": "enum",
                "function": spectral_functions_1.falsy
            }
        },
        "az-consistent-response-body": {
            "description": "Ensure the get, put, and patch response body schemas are consistent.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths.*",
            "then": {
                "function": consistent_response_body_1.default
            }
        },
        "az-default-response": {
            "description": "All operations should have a default (error) response.",
            "message": "Operation is missing a default response.",
            "severity": "warn",
            "given": "$.paths.*.*.responses",
            "then": {
                "field": "default",
                "function": spectral_functions_1.truthy
            }
        },
        "az-delete-204-response": {
            "description": "A delete operation should have a 204 response.",
            "message": "A delete operation should have a `204` response.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths[*].delete.responses",
            "then": {
                "function": delete_204_response_1.default
            }
        },
        "az-error-response": {
            "description": "Error response body should conform to Microsoft Azure API Guidelines.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths[*][*].responses",
            "then": {
                "function": error_response_1.default
            }
        },
        "az-formdata": {
            "description": "Check for appropriate use of formData parameters.",
            "severity": "info",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.in == \"formData\")]",
            "then": {
                "function": spectral_functions_1.falsy
            }
        },
        "az-header-disallowed": {
            "description": "Authorization, Content-type, and Accept headers should not be defined explicitly.",
            "message": "Header parameter \"{{value}}\" should not be defined explicitly.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": ["$.paths[*].parameters.[?(@.in == 'header')]", "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.in == 'header')]"],
            "then": {
                "function": spectral_functions_1.pattern,
                "field": "name",
                "functionOptions": {
                    "notMatch": "/^(authorization|content-type|accept)$/i"
                }
            }
        },
        "az-lro-extension": {
            "description": "Operations with a 202 response should specify `x-ms-long-running-operation: true`.",
            "message": "Operations with a 202 response should specify `x-ms-long-running-operation: true`.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths[*][*].responses[?(@property == '202')]^^",
            "then": {
                "field": "x-ms-long-running-operation",
                "function": spectral_functions_1.truthy
            }
        },
        "az-lro-headers": {
            "description": "A 202 response should include an Operation-Location response header.",
            "message": "A 202 response should include an Operation-Location response header.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths[*][*].responses[?(@property == '202')]",
            "then": {
                "function": has_header_1.default,
                "functionOptions": {
                    "name": "Operation-location"
                }
            }
        },
        "az-ms-paths": {
            "description": "Don't use x-ms-paths except where necessary to support legacy APIs.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.x-ms-paths",
            "then": {
                "function": spectral_functions_1.falsy
            }
        },
        "az-nullable": {
            "description": "Avoid the use of x-nullable.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "resolved": false,
            "given": "$..x-nullable",
            "then": {
                "function": spectral_functions_1.undefined
            }
        },
        "az-operation-id": {
            "description": "OperationId should conform to Azure API Guidelines",
            "message": "{{error}}",
            "severity": "warn",
            "given": ["$.paths.*[get,put,post,patch,delete,options,head]"],
            "then": {
                "function": operation_id_1.default
            }
        },
        "az-operation-summary-or-description": {
            "description": "Operation should have a summary or description.",
            "message": "Operation should have a summary or description.",
            "severity": "warn",
            "given": ["$.paths[*][?( @property === 'get' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'put' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'post' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'patch' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'delete' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'options' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'head' && !@.summary && !@.description )]", "$.paths[*][?( @property === 'trace' && !@.summary && !@.description )]"],
            "then": {
                "function": spectral_functions_1.falsy
            }
        },
        "az-pagination-response": {
            "description": "An operation that returns a list that is potentially large should support pagination.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": ["$.paths.*[get,post]"],
            "then": {
                "function": pagination_response_1.default
            }
        },
        "az-parameter-default-not-allowed": {
            "description": "A required parameter should not specify a default value.",
            "severity": "warn",
            "given": ["$.paths[*].parameters.[?(@.required)]", "$.paths.*[get,put,post,patch,delete,options,head].parameters.[?(@.required)]"],
            "then": {
                "field": "default",
                "function": spectral_functions_1.falsy
            }
        },
        "az-parameter-description": {
            "description": "All parameters should have a description.",
            "message": "Parameter should have a description.",
            "severity": "warn",
            "given": ["$.paths[*].parameters.*", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*"],
            "then": {
                "field": "description",
                "function": spectral_functions_1.truthy
            }
        },
        "az-parameter-names-convention": {
            "description": "Parameter names should conform to Azure naming conventions.",
            "message": "{{error}}",
            "severity": "warn",
            "given": ["$.paths[*].parameters.*", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*"],
            "then": {
                "function": param_names_1.default
            }
        },
        "az-parameter-names-unique": {
            "description": "All parameter names for an operation should be case-insensitive unique.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths[*]",
            "then": {
                "function": param_names_unique_1.default
            }
        },
        "az-parameter-order": {
            "description": "Path parameters must be in the same order as in the path.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths",
            "then": {
                "function": param_order_1.default
            }
        },
        "az-path-parameter-names": {
            "description": "Path parameter names should be consistent across all paths.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths",
            "then": {
                "function": path_param_names_1.default
            }
        },
        "az-patch-content-type": {
            "description": "The request body content type for patch operations should be JSON merge patch.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$",
            "then": {
                "function": patch_content_type_1.default
            }
        },
        "az-path-characters": {
            "description": "Path should contain only recommended characters.",
            "message": "Path contains non-recommended characters.",
            "severity": "info",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths.*~",
            "then": {
                "function": spectral_functions_1.pattern,
                "functionOptions": {
                    "match": "^(/([0-9A-Za-z._~-]+|{[^}]+}))*(/([0-9A-Za-z._~:-]+|{[^}]*}(:[0-9A-Za-z._~-]+)?))$"
                }
            }
        },
        "az-path-parameter-schema": {
            "description": "Path parameter should be type: string and specify maxLength and pattern.",
            "message": "{{error}}",
            "severity": "info",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": ["$.paths[*].parameters[?(@.in == 'path')]", "$.paths.*[get,put,post,patch,delete,options,head].parameters[?(@.in == 'path')]"],
            "then": {
                "function": path_param_schema_1.default
            }
        },
        "az-post-201-response": {
            "description": "Using post for a create operation is discouraged.",
            "message": "Using post for a create operation is discouraged.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths[*].post.responses",
            "then": {
                "field": "201",
                "function": spectral_functions_1.falsy
            }
        },
        "az-property-description": {
            "description": "All schema properties should have a description.",
            "message": "Property should have a description.",
            "severity": "warn",
            "resolved": false,
            "given": "$..properties[?(@object() && @.$ref == undefined)]",
            "then": {
                "field": "description",
                "function": spectral_functions_1.truthy
            }
        },
        "az-property-names-convention": {
            "description": "Property names should be camel case.",
            "message": "Property name should be camel case.",
            "severity": "warn",
            "resolved": false,
            "given": "$..[?(@.type === 'object' && @.properties)].properties.*~",
            "then": {
                "function": spectral_functions_1.casing,
                "functionOptions": {
                    "type": "camel"
                }
            }
        },
        "az-property-type": {
            "description": "All schema properties should have a defined type.",
            "message": "Property should have a defined type.",
            "severity": "warn",
            "resolved": false,
            "given": "$..properties[?(@object() && @.$ref == undefined)]",
            "then": {
                "field": "type",
                "function": spectral_functions_1.truthy
            }
        },
        "az-put-path": {
            "description": "The path for a put should have a final path parameter.",
            "message": "The path for a put should have a final path parameter.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.paths[*].put^~",
            "then": {
                "function": spectral_functions_1.pattern,
                "functionOptions": {
                    "match": "/\\}$/"
                }
            }
        },
        "az-request-body-not-allowed": {
            "description": "A get or delete operation must not accept a body parameter.",
            "severity": "error",
            "formats": [spectral_formats_1.oas2],
            "given": ["$.paths[*].[get,delete].parameters[*]"],
            "then": {
                "field": "in",
                "function": spectral_functions_1.pattern,
                "functionOptions": {
                    "notMatch": "/^body$/"
                }
            }
        },
        "az-request-body-optional": {
            "description": "Flag optional request body -- common oversight.",
            "message": "The body parameter is not marked as required.",
            "severity": "info",
            "formats": [spectral_formats_1.oas2],
            "given": ["$.paths[*].[put,post,patch].parameters.[?(@.in == 'body')]"],
            "then": {
                "field": "required",
                "function": spectral_functions_1.truthy
            }
        },
        "az-schema-description-or-title": {
            "description": "All schemas should have a description or title.",
            "message": "Schema should have a description or title.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": ["$.definitions[?(!@.description && !@.title)]", "$.components.schemas[?(!@.description && !@.title)]"],
            "then": {
                "function": spectral_functions_1.falsy
            }
        },
        "az-schema-names-convention": {
            "description": "Schema names should be Pascal case.",
            "message": "Schema name should be Pascal case.",
            "severity": "info",
            "formats": [spectral_formats_1.oas2],
            "given": "$.definitions.*~",
            "then": {
                "function": spectral_functions_1.casing,
                "functionOptions": {
                    "type": "pascal"
                }
            }
        },
        "az-security-definition-description": {
            "description": "A security definition should have a description.",
            "message": "Security definition should have a description.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": ["$.securityDefinitions[*]", "$.components.securitySchemes[*]"],
            "then": {
                "field": "description",
                "function": spectral_functions_1.truthy
            }
        },
        "az-success-response-body": {
            "description": "All success responses except 202 & 204 should define a response body.",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$.paths[*][*].responses[?(@property >= 200 && @property < 300 && @property != '202' && @property != '204')]",
            "then": {
                "field": "schema",
                "function": spectral_functions_1.truthy
            }
        },
        "az-version-convention": {
            "description": "API version should be a date in YYYY-MM-DD format, optionally suffixed with '-preview'.",
            "severity": "error",
            "formats": [spectral_formats_1.oas2, spectral_formats_1.oas3],
            "given": "$.info.version",
            "then": {
                "function": spectral_functions_1.pattern,
                "functionOptions": {
                    "match": "^\\d\\d\\d\\d-\\d\\d-\\d\\d(-preview)?$"
                }
            }
        },
        "az-version-policy": {
            "description": "Specify API version using `api-version` query parameter, not in path.",
            "message": "{{error}}",
            "severity": "warn",
            "formats": [spectral_formats_1.oas2],
            "given": "$",
            "then": {
                "function": version_policy_1.default
            }
        }
    }
};
var common = ruleset$1;

const common_1 = __importDefault(common);
const ruleset = {
    extends: [
        common_1.default
    ],
    rules: {}
};
var arm = ruleset;

exports.arm = arm;
exports.common = common;
