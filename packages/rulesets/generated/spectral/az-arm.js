import { oas2, oas3 } from '@stoplight/spectral-formats';
import { pattern, falsy, truthy } from '@stoplight/spectral-functions';
import { createRulesetFunction } from '@stoplight/spectral-core';

const avoidAnonymousSchema = (schema, _opts, paths) => {
    if (schema === null || schema["x-ms-client-name"] !== undefined) {
        return [];
    }
    const path = paths.path || [];
    const properties = schema.properties;
    if ((properties === undefined || Object.keys(properties).length === 0) &&
        schema.additionalProperties === undefined &&
        schema.allOf === undefined) {
        return [];
    }
    return [
        {
            message: 'Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.',
            path,
        },
    ];
};

const avoidMsdnReferences = (swaggerObj, _opts, paths) => {
    if (swaggerObj === null) {
        return [];
    }
    if (typeof swaggerObj === "string" && !swaggerObj.includes("https://msdn.microsoft.com"))
        return [];
    if (typeof swaggerObj === "object") {
        const docUrl = swaggerObj.url;
        if (docUrl === undefined || !docUrl.startsWith("https://msdn.microsoft.com"))
            return [];
    }
    const path = paths.path || [];
    return [{
            message: 'For better generated code quality, remove all references to "msdn.microsoft.com".',
            path,
        }];
};

const defaultInEnum = (swaggerObj, _opts, paths) => {
    const defaultValue = swaggerObj.default;
    const enumValue = swaggerObj.enum;
    if (swaggerObj === null ||
        typeof swaggerObj !== "object" ||
        !defaultValue === null ||
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
        return [
            {
                message: "Default value should appear in the enum constraint for a schema.",
                path,
            },
        ];
    }
    return [];
};

const deleteInOperationName = (operationId, _opts, ctx) => {
    if (operationId === "" || typeof operationId !== "string") {
        return [];
    }
    if (!operationId.includes("_")) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    if (!operationId.match(/^(\w+)_(Delete)/) && !operationId.match(/^(Delete)/)) {
        errors.push({
            message: `'DELETE' operation '${operationId}' should use method name 'Delete'. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.`,
            path: [...path],
        });
    }
    return errors;
};

const descriptiveDescriptionRequired = (swaggerObj, _opts, paths) => {
    if (swaggerObj === null || typeof swaggerObj !== "string") {
        return [];
    }
    if (swaggerObj.trim().length != 0) {
        return [];
    }
    const path = paths.path || [];
    return [{
            message: 'The value provided for description is not descriptive enough. Accurate and descriptive description is essential for maintaining reference documentation.',
            path,
        }];
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

const longRunningOperationsOptionsValidator = (postOp, _opts, ctx) => {
    var _a, _b, _c;
    if (postOp === null || typeof postOp !== "object") {
        return [];
    }
    const path = ctx.path || [];
    if (!postOp["x-ms-long-running-operation"]) {
        return [];
    }
    const errors = [];
    const responses = postOp === null || postOp === void 0 ? void 0 : postOp.responses;
    let schemaAvailable = false;
    for (const responseCode in responses) {
        if (responseCode[0] === "2" && ((_a = responses[responseCode]) === null || _a === void 0 ? void 0 : _a.schema) !== undefined) {
            schemaAvailable = true;
            break;
        }
    }
    if (schemaAvailable &&
        ((_b = postOp === null || postOp === void 0 ? void 0 : postOp["x-ms-long-running-operation-options"]) === null || _b === void 0 ? void 0 : _b["final-state-via"]) !== "location" &&
        ((_c = postOp === null || postOp === void 0 ? void 0 : postOp["x-ms-long-running-operation-options"]) === null || _c === void 0 ? void 0 : _c["final-state-via"]) !== "azure-async-operation") {
        errors.push({
            message: `A LRO Post operation with return schema must have "x-ms-long-running-operation-options" extension enabled.`,
            path: [...path.slice(0, -1)],
        });
    }
    return errors;
};

const mutabilityWithReadOnly = (prop, _opts, ctx) => {
    if (prop === null || typeof prop !== "object") {
        return [];
    }
    if (prop.readOnly === undefined ||
        prop["x-ms-mutability"] === undefined ||
        prop["x-ms-mutability"].length === 0) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    let hasErrors = false;
    let invalidValues = "";
    if (prop.readOnly === true) {
        if (prop["x-ms-mutability"].length !== 1 || prop["x-ms-mutability"][0] !== "read") {
            hasErrors = true;
            invalidValues = prop["x-ms-mutability"].join(", ");
        }
    }
    else {
        if (prop["x-ms-mutability"].length === 1 && prop["x-ms-mutability"][0] === "read") {
            hasErrors = true;
            invalidValues = "read";
        }
    }
    if (hasErrors) {
        errors.push({
            message: `When property is modeled as "readOnly": true then x-ms-mutability extension can only have "read" value. When property is modeled as "readOnly": false then applying x-ms-mutability extension with only "read" value is not allowed. Extension contains invalid values: '${invalidValues}'.`,
            path: [...path],
        });
    }
    return errors;
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
function getProperty(schema, propName) {
    if (!schema) {
        return {};
    }
    if (schema.allOf && Array.isArray(schema.allOf)) {
        for (const base of schema.allOf) {
            const result = getProperty(base, propName);
            if (result) {
                return result;
            }
        }
    }
    if (schema.properties) {
        if (propName in schema.properties) {
            return schema.properties[propName];
        }
    }
    return undefined;
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
    var _a, _b, _c;
    const getOperationPath = [...paths, "get"];
    const getOperation = jsonPath(getOperationPath, (_a = ctx === null || ctx === void 0 ? void 0 : ctx.documentInventory) === null || _a === void 0 ? void 0 : _a.resolved);
    if (!getOperation) {
        return undefined;
    }
    return ((_b = getOperation === null || getOperation === void 0 ? void 0 : getOperation.responses["200"]) === null || _b === void 0 ? void 0 : _b.schema) || ((_c = getOperation === null || getOperation === void 0 ? void 0 : getOperation.responses["201"]) === null || _c === void 0 ? void 0 : _c.schema);
}
function isPageableOperation(operation) {
    return !!(operation === null || operation === void 0 ? void 0 : operation["x-ms-pageable"]);
}
function getReturnedType(operation) {
    var _a;
    const succeededCodes = ["200", "201", "202"];
    for (const code of succeededCodes) {
        const response = operation.responses[code];
        if (response) {
            return (_a = response === null || response === void 0 ? void 0 : response.schema) === null || _a === void 0 ? void 0 : _a.$ref;
        }
    }
}
function getReturnedSchema(operation) {
    const succeededCodes = ["200", "201"];
    for (const code of succeededCodes) {
        const response = operation.responses[code];
        if (response === null || response === void 0 ? void 0 : response.schema) {
            return response === null || response === void 0 ? void 0 : response.schema;
        }
    }
}
function isXmsResource(schema) {
    if (!schema) {
        return false;
    }
    if (schema["x-ms-azure-resource"]) {
        return true;
    }
    if (schema.allOf && Array.isArray(schema.allOf)) {
        for (const base of schema.allOf) {
            if (isXmsResource(base)) {
                return true;
            }
        }
    }
    return false;
}
function isSchemaEqual(a, b) {
    if (a && b) {
        const propsA = Object.getOwnPropertyNames(a);
        const propsB = Object.getOwnPropertyNames(b);
        if (propsA.length === propsB.length) {
            for (let i = 0; i < propsA.length; i++) {
                const propsAName = propsA[i];
                const [propA, propB] = [a[propsAName], b[propsAName]];
                if (typeof propA === "object") {
                    if (!isSchemaEqual(propA, propB)) {
                        return false;
                    }
                    else if (i === propsA.length - 1) {
                        return true;
                    }
                }
                else if (propA !== propB) {
                    return false;
                }
                else if (propA === propB && i === propsA.length - 1) {
                    return true;
                }
            }
        }
    }
    return false;
}
const providerAndNamespace = "/providers/[^/]+";
const resourceTypeAndResourceName = "(?:/\\w+/default|/\\w+/{[^/]+})";
const queryParam = "(?:\\?\\w+)";
const resourcePathRegEx = new RegExp(`${providerAndNamespace}${resourceTypeAndResourceName}+${queryParam}?$`, "gi");
function getResourcesPathHierarchyBasedOnResourceType(path) {
    const index = path.lastIndexOf("/providers/");
    if (index === -1) {
        return [];
    }
    const lastProvider = path.substr(index);
    const result = [];
    const matches = lastProvider.match(resourcePathRegEx);
    if (matches && matches.length) {
        const match = matches[0];
        const resourcePathSegments = match.split("/").slice(3);
        for (const resourcePathSegment of resourcePathSegments) {
            if (resourcePathSegment.startsWith("{") || resourcePathSegment === "default") {
                continue;
            }
            result.push(resourcePathSegment);
        }
    }
    return result;
}

const nextLinkPropertyMustExist = (opt, _opts, ctx) => {
    var _a, _b, _c;
    if (opt === null || typeof opt !== "object") {
        return [];
    }
    if (opt["x-ms-pageable"] === undefined) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const nextLinkName = ((_a = opt["x-ms-pageable"]) === null || _a === void 0 ? void 0 : _a.nextLinkName) || null;
    const responseSchemaProperties = getProperties((_c = (_b = opt === null || opt === void 0 ? void 0 : opt.responses) === null || _b === void 0 ? void 0 : _b["200"]) === null || _c === void 0 ? void 0 : _c.schema);
    if (nextLinkName !== null && nextLinkName !== "") {
        if (Object.keys(responseSchemaProperties).length === 0 ||
            !Object.keys(responseSchemaProperties).includes(nextLinkName)) {
            errors.push({
                message: `The property '${nextLinkName}' specified by nextLinkName does not exist in the 200 response schema. Please, specify the name of the property that provides the nextLink. If the model does not have the nextLink property then specify null.`,
                path: [...path],
            });
        }
    }
    return errors;
};

const xmsClientName = (opt, _opts, ctx) => {
    if (opt === null || typeof opt !== "object") {
        return [];
    }
    if (opt["x-ms-client-name"] === undefined) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    if (path.includes("parameters")) {
        if (opt["x-ms-client-name"] === opt.name) {
            errors.push({
                message: `Value of 'x-ms-client-name' cannot be the same as '${opt.name}' Property/Model.`,
                path: [...path],
            });
        }
    }
    else {
        if (opt["x-ms-client-name"] === path.slice(-1)[0]) {
            errors.push({
                message: `Value of 'x-ms-client-name' cannot be the same as '${path.slice(-1)[0]}' Property/Model.`,
                path: [...path],
            });
        }
    }
    return errors;
};

const xmsPathsMustOverloadPaths = (xmsPaths, _opts, ctx) => {
    var _a;
    if (xmsPaths === null || typeof xmsPaths !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const swagger = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.documentInventory) === null || _a === void 0 ? void 0 : _a.resolved;
    for (const xmsPath in xmsPaths) {
        const pathName = xmsPath.split("?")[0];
        if (!Object.keys(swagger.paths).includes(pathName)) {
            errors.push({
                message: `Paths in x-ms-paths must overload a normal path in the paths section, i.e. a path in the x-ms-paths must either be same as a path in the paths section or a path in the paths sections followed by additional parameters.`,
                path: [...path, xmsPath],
            });
        }
    }
    return errors;
};

const getInOperationName = (operationId, _opts, ctx) => {
    if (operationId === "" || typeof operationId !== "string") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    if (!operationId.match(/^(\w+)_(Get|List)/) && !operationId.match(/^(Get|List)/)) {
        errors.push({
            message: `'GET' operation '${operationId}' should use method name 'Get' or Method name start with 'List'. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.`,
            path: [...path],
        });
    }
    return errors;
};

const listInOperationName = (swaggerObj, _opts, paths) => {
    if (swaggerObj === null && typeof swaggerObj !== "object") {
        return [];
    }
    const listRegex = /^((\w+_List\w*)|List)$/;
    const path = paths.path;
    if (swaggerObj["x-ms-pageable"] !== undefined) {
        if (!listRegex.test(swaggerObj.operationId)) {
            return [
                {
                    message: "Since operation '${swaggerObj.operationId}' response has model definition 'x-ms-pageable', it should be of the form \\\"*_list*\\\". Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.",
                    path: [...path, path[path.length - 1], "operationId"],
                },
            ];
        }
        else {
            return [];
        }
    }
    if (swaggerObj.responses === undefined)
        return [];
    const responseList = swaggerObj.responses;
    let gotArray = false;
    Object.values(responseList).some((response) => {
        var _a, _b;
        if (response.schema) {
            if (((_b = (_a = response.schema.properties) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.type) === "array" && Object.keys(response.schema.properties).length <= 2) {
                if (!listRegex.test(swaggerObj["operationId"])) {
                    gotArray = true;
                    return true;
                }
            }
        }
        return false;
    });
    if (gotArray)
        return [
            {
                message: "Since operation `${swaggerObj.operationId}` response has model definition 'array', it should be of the form \"_\\_list_\".",
                path: [...path, path[path.length - 1], "operationId"],
            },
        ];
    return [];
};

const lroStatusCodesReturnTypeSchema = (putOp, _opts, ctx) => {
    if (putOp === null || typeof putOp !== "object") {
        return [];
    }
    const path = ctx.path || [];
    if (!putOp["x-ms-long-running-operation"]) {
        return [];
    }
    const errors = [];
    const operationId = putOp["operationId"] || "";
    const responseCodes = ["200", "201"];
    for (const responseCode of responseCodes) {
        if ((putOp === null || putOp === void 0 ? void 0 : putOp.responses) && (putOp === null || putOp === void 0 ? void 0 : putOp.responses[responseCode])) {
            if (!(putOp === null || putOp === void 0 ? void 0 : putOp.responses[responseCode].schema) ||
                Object.keys(putOp === null || putOp === void 0 ? void 0 : putOp.responses[responseCode].schema).length === 0) {
                errors.push({
                    message: `200/201 Responses of long running operations must have a schema definition for return type. OperationId: '${operationId}', Response code: '${responseCode}'`,
                    path: [...path, "responses", `${responseCode}`],
                });
            }
        }
    }
    return errors;
};

const namePropertyDefinitionInParameter = (parameters, _opts, ctx) => {
    if (parameters === null || typeof parameters !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const propsParameters = Object.getOwnPropertyNames(parameters);
    if (propsParameters.length === 0) {
        return [];
    }
    for (const propsParameter of propsParameters) {
        if (propsParameter === "length") {
            continue;
        }
        const parameter = parameters[propsParameter];
        if (!parameter.name || parameter.name === "") {
            errors.push({
                message: `Parameter Must have the "name" property defined with non-empty string as its value`,
                path: [...path],
            });
        }
    }
    return errors;
};

const operationIdSingleUnderscore = (operationId, _opts, ctx) => {
    if (operationId === "" || typeof operationId !== "string") {
        return [];
    }
    if (!operationId.includes("_")) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    if (operationId.match(/_/g).length > 1) {
        errors.push({
            message: `Only 1 underscore is permitted in the operation id, following Noun_Verb conventions`,
            path: [...path],
        });
    }
    return errors;
};

const operationIdNounConflictingModelNames = (operationId, _opts, ctx) => {
    var _a;
    if (operationId === "" || typeof operationId !== "string") {
        return [];
    }
    if (!operationId.includes("_")) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const nounPartOfOperationId = operationId.split("_")[0];
    const swagger = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.documentInventory) === null || _a === void 0 ? void 0 : _a.resolved;
    const definitionsList = swagger.definitions ? Object.keys(swagger.definitions) : [];
    if (definitionsList.includes(nounPartOfOperationId)) {
        errors.push({
            message: `OperationId has a noun that conflicts with one of the model names in definitions section. The model name will be disambiguated to '${nounPartOfOperationId}Model'. Consider using the plural form of '${nounPartOfOperationId}' to avoid this. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.`,
            path: [...path],
        });
    }
    return errors;
};

const operationIdNounVerb = (operationId, _opts, ctx) => {
    if (operationId === "" || typeof operationId !== "string") {
        return [];
    }
    if (!operationId.includes("_")) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const nounPartOfOperationId = operationId.split("_")[0];
    const nounSearchPattern = nounPartOfOperationId.slice(-1) === "s"
        ? `${nounPartOfOperationId}?`
        : `${nounPartOfOperationId}`;
    const verbPartOfOperationId = operationId.split("_")[1];
    if (verbPartOfOperationId.match(nounSearchPattern)) {
        errors.push({
            message: `Per the Noun_Verb convention for Operation Ids, the noun '${nounPartOfOperationId}' should not appear after the underscore. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.`,
            path: [...path],
        });
    }
    return errors;
};

function paramLocation(paramSchema, options, { path }) {
    if (paramSchema === null || typeof paramSchema !== "object") {
        return [];
    }
    const errors = [];
    if (!paramSchema["x-ms-parameter-location"]) {
        errors.push({
            message: ``,
            path,
        });
    }
    return errors;
}

const patchInOperationName = (operationId, _opts, ctx) => {
    if (operationId === "" || typeof operationId !== "string") {
        return [];
    }
    if (!operationId.includes("_")) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    if (!operationId.match(/^(\w+)_(Update)/) && !operationId.match(/^(Update)/)) {
        errors.push({
            message: `'PATCH' operation '${operationId}' should use method name 'Update'. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.`,
            path: [...path],
        });
    }
    return errors;
};

const putInOperationName = (operationId, _opts, ctx) => {
    if (operationId === "" || typeof operationId !== "string") {
        return [];
    }
    if (!operationId.includes("_")) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    if (!operationId.match(/^(\w+)_(Create)/) && !operationId.match(/^(Create)/)) {
        errors.push({
            message: `'PUT' operation '${operationId}' should use method name 'Create'. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.`,
            path: [...path],
        });
    }
    return errors;
};

const requiredReadOnlyProperties = (definition, _opts, ctx) => {
    if (definition === null || typeof definition !== "object") {
        return [];
    }
    if (!Array.isArray(definition.required) ||
        (Array.isArray(definition.required) && definition.required.length === 0)) {
        return [];
    }
    if (!definition.properties) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const required = definition.required;
    const properties = definition.properties;
    for (const property in properties) {
        if (properties[property].readOnly === true && required.includes(property)) {
            errors.push({
                message: `Property '${property}' is a required property. It should not be marked as 'readonly'`,
                path: [...path],
            });
        }
    }
    return errors;
};

function checkSchemaFormat(schema, options, { path }) {
    if (schema === null || typeof schema !== "object") {
        return [];
    }
    const errors = [];
    const schemaFormats = [
        "int32",
        "int64",
        "float",
        "double",
        "unixtime",
        "byte",
        "binary",
        "date",
        "date-time",
        "password",
        "char",
        "time",
        "date-time-rfc1123",
        "date-time-rfc7231",
        "duration",
        "uuid",
        "base64url",
        "url",
        "odata-query",
        "certificate",
        "uri",
        "uri-reference",
        "uri-template",
        "email",
        "hostname",
        "ipv4",
        "ipv6",
        "regex",
        "json-pointer",
        "relative-json-pointer",
        "arm-id",
    ];
    if (schema.type && schema.format) {
        if (!schemaFormats.includes(schema.format)) {
            errors.push({
                message: `${schema.format}`,
                path: [...path, "format"],
            });
        }
    }
    return errors;
}

function checkSummaryAndDescription(op, options, ctx) {
    const errors = [];
    const path = ctx.path;
    if (op.summary && op.description && op.summary.trim() === op.description.trim()) {
        errors.push({
            message: ``,
            path,
        });
    }
    return errors;
}

const xmsClientNameParameter = (swaggerObj, _opts, paths) => {
    if (swaggerObj === null) {
        return [];
    }
    if (swaggerObj.name !== swaggerObj['x-ms-client-name'])
        return [];
    const path = paths.path || [];
    path.push('x-ms-client-name');
    return [
        {
            message: `Value of 'x-ms-client-name' cannot be the same as ${swaggerObj.name} Property/Model.`,
            path: path
        },
    ];
};

const xmsClientNameProperty = (swaggerObj, _opts, paths) => {
    if (swaggerObj === null || typeof swaggerObj !== "string") {
        return [];
    }
    const path = paths.path || [];
    if (!path || path.length <= 2)
        return [];
    const name = path[path.length - 2];
    if (swaggerObj !== name)
        return [];
    return [
        {
            message: `Value of 'x-ms-client-name' cannot be the same as ${name} Property/Model.`,
            path: path
        },
    ];
};

const xmsExamplesRequired = (swaggerObj, _opts, paths) => {
    if (swaggerObj === null || typeof swaggerObj !== "object") {
        return [];
    }
    if (swaggerObj["x-ms-examples"] !== undefined && Object.keys(swaggerObj["x-ms-examples"].length > 0))
        return [];
    const path = paths.path || [];
    return [
        {
            message: `Please provide x-ms-examples describing minimum/maximum property set for response/request payloads for operations.`,
            path: path,
        },
    ];
};

const ruleset$1 = {
    extends: [],
    rules: {
        docLinkLocale: {
            description: "This rule is to ensure the documentation link in the description does not contains any locale.",
            message: "The documentation link in the description contains locale info, please change it to the link without locale.",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$..[?(@property === 'description')]^"],
            then: {
                function: pattern,
                functionOptions: {
                    match: "https://docs.microsoft.com/\\w+\\-\\w+/azure/.*",
                },
            },
        },
        OperationSummaryOrDescription: {
            description: "Operation should have a summary or description.",
            message: "Operation should have a summary or description.",
            severity: "warn",
            given: [
                "$.paths[*][?( @property === 'get' && !@.summary && !@.description )]",
                "$.paths[*][?( @property === 'put' && !@.summary && !@.description )]",
                "$.paths[*][?( @property === 'post' && !@.summary && !@.description )]",
                "$.paths[*][?( @property === 'patch' && !@.summary && !@.description )]",
                "$.paths[*][?( @property === 'delete' && !@.summary && !@.description )]",
                "$.paths[*][?( @property === 'options' && !@.summary && !@.description )]",
                "$.paths[*][?( @property === 'head' && !@.summary && !@.description )]",
                "$.paths[*][?( @property === 'trace' && !@.summary && !@.description )]",
            ],
            then: {
                function: falsy,
            },
        },
        SchemaDescriptionOrTitle: {
            description: "All schemas should have a description or title.",
            message: "Schema should have a description or title.",
            severity: "warn",
            formats: [oas2, oas3],
            given: ["$.definitions[?(!@.description && !@.title)]", "$.components.schemas[?(!@.description && !@.title)]"],
            then: {
                function: falsy,
            },
        },
        ParameterDescription: {
            description: "All parameters should have a description.",
            message: "Parameter should have a description.",
            severity: "warn",
            given: ["$.paths[*].parameters.*", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*"],
            then: {
                field: "description",
                function: truthy,
            },
        },
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
        LroExtension: {
            description: "Operations with a 202 response must specify `x-ms-long-running-operation: true`.",
            message: "Operations with a 202 response must specify `x-ms-long-running-operation: true`.",
            severity: "error",
            formats: [oas2],
            given: "$.paths[*][*].responses[?(@property == '202')]^^",
            then: {
                field: "x-ms-long-running-operation",
                function: truthy,
            },
        },
        LroStatusCodesReturnTypeSchema: {
            description: "The '200'/'201' responses of the long running operation must have a schema definition.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[put][?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
            then: {
                function: lroStatusCodesReturnTypeSchema,
            },
        },
        NamePropertyDefinitionInParameter: {
            description: "A parameter must have a `name` property for the SDK to be properly generated.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$.parameters", "$.paths.*.parameters", "$.paths.*.*.parameters"],
            then: {
                function: namePropertyDefinitionInParameter,
            },
        },
        OperationIdNounConflictingModelNames: {
            description: "The first part of an operation Id separated by an underscore i.e., `Noun` in a `Noun_Verb` should not conflict with names of the models defined in the definitions section. If this happens, AutoRest appends `Model` to the name of the model to resolve the conflict (`NounModel` in given example) with the name of the client itself (which will be named as `Noun` in given example). This can result in an inconsistent user experience.",
            message: "{{error}}",
            severity: "warn",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'operationId')]"],
            then: {
                function: operationIdNounConflictingModelNames,
            },
        },
        OperationIdNounVerb: {
            description: "OperationId should be of the form `Noun_Verb`.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'operationId')]"],
            then: {
                function: operationIdNounVerb,
            },
        },
        OperationIdSingleUnderscore: {
            description: "An operationId can have exactly one underscore, not adhering to it can cause errors in code generation.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'operationId')]"],
            then: {
                function: operationIdSingleUnderscore,
            },
        },
        GetInOperationName: {
            description: "Verifies whether value for `operationId` is named as per ARM guidelines.",
            message: "{{error}}",
            severity: "warn",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[get][?(@property === 'operationId')]"],
            then: {
                function: getInOperationName,
            },
        },
        PutInOperationName: {
            description: "Verifies whether value for `operationId` is named as per ARM guidelines.",
            message: "{{error}}",
            severity: "warn",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[put][?(@property === 'operationId')]"],
            then: {
                function: putInOperationName,
            },
        },
        PatchInOperationName: {
            description: "Verifies whether value for `operationId` is named as per ARM guidelines.",
            message: "{{error}}",
            severity: "warn",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[patch][?(@property === 'operationId')]"],
            then: {
                function: patchInOperationName,
            },
        },
        DeleteInOperationName: {
            description: "Verifies whether value for `operationId` is named as per ARM guidelines.",
            message: "{{error}}",
            severity: "warn",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[delete][?(@property === 'operationId')]"],
            then: {
                function: deleteInOperationName,
            },
        },
        RequiredReadOnlyProperties: {
            description: "A model property cannot be both `readOnly` and `required`. A `readOnly` property is something that the server sets when returning the model object while `required` is a property to be set when sending it as a part of the request body.",
            message: "{{error}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$..?(@property === 'required')^"],
            then: {
                function: requiredReadOnlyProperties,
            },
        },
        SummaryAndDescriptionMustNotBeSame: {
            description: `Each operation has a summary and description values. They must not be same.`,
            message: "The summary and description values should not be same.",
            severity: "warn",
            resolved: false,
            given: "$[paths,'x-ms-paths'].*.*",
            then: {
                function: checkSummaryAndDescription,
            },
        },
        ValidFormats: {
            description: `Only valid types are allowed for properties.`,
            message: "'{{error}}' is not a known format.",
            severity: "error",
            resolved: false,
            given: "$..[?(@property === 'format')]^",
            then: {
                function: checkSchemaFormat,
            },
        },
        XmsParameterLocation: {
            description: `SDKs generated by AutoRest have two types of operation parameters: method arguments and client fields. The 'x-ms-parameter-location' extension gives the Swagger author control of how an operation-parameter will be interpreted by AutoRest, and as such is one of few things in a Swagger document that has semantic value only relevant to the shape of the generated SDKs.
    Some parameters, such as API Version and Subscription ID will make sense as part of nearly every request. For these, having developers specify them for each method call would be burdensome; attaching them to the client and automatically including them in each request makes way more sense. Other parameters will be very operation specific and should be provided each time the method is called.`,
            message: 'The parameter \'{{property}}\' is defined in global parameters section without \'x-ms-parameter-location\' extension. This would add the parameter as the client property. Please ensure that this is exactly you want. If so, apply the extension "x-ms-parameter-location": "client". Else, apply the extension "x-ms-parameter-location": "method".',
            severity: "error",
            resolved: false,
            given: "$.parameters.*[?(@property === 'name' && @.match(/^(subscriptionid|subscription-id|api-version|apiversion)$/i))]^",
            then: {
                function: paramLocation,
            },
        },
        LongRunningOperationsOptionsValidator: {
            description: 'A LRO Post operation with return schema should have "x-ms-long-running-operation-options" extension enabled.',
            message: "{{error}}",
            severity: "warn",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[post][?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
            then: {
                function: longRunningOperationsOptionsValidator,
            },
        },
        MutabilityWithReadOnly: {
            description: 'Verifies whether a model property which has a readOnly property set has the appropriate `x-ms-mutability` options. If `readonly: true`, `x-ms-mutability` must be `["read"]`. If `readonly: false`, `x-ms-mutability` can be any of the `x-ms-mutability` options.',
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths']..?(@property === 'readOnly')^"],
            then: {
                function: mutabilityWithReadOnly,
            },
        },
        NextLinkPropertyMustExist: {
            description: "Per definition of AutoRest x-ms-pageable extension, the property specified by nextLinkName must exist in the 200 response schema.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-pageable')]^"],
            then: {
                function: nextLinkPropertyMustExist,
            },
        },
        NonEmptyClientName: {
            description: "The 'x-ms-client-name' extension is used to change the name of a parameter or property in the generated code.",
            message: "Empty x-ms-client-name property.",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths']..?(@property === 'x-ms-client-name')"],
            then: {
                function: truthy,
            },
        },
        PageableRequires200Response: {
            description: "Per definition of AutoRest x-ms-pageable extension, the response schema must contain a 200 response schema.",
            message: "A response for the 200 HTTP status code must be defined to use x-ms-pageable.",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-pageable')]^"],
            then: {
                field: "[responses][200]",
                function: truthy,
            },
        },
        ResourceHasXMsResourceEnabled: {
            description: "A 'Resource' definition must have x-ms-azure-resource extension enabled and set to true. This will indicate that the model is an Azure resource.",
            message: "A 'Resource' definition must have x-ms-azure-resource extension enabled and set to true.",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$.definitions[?(@property === 'Resource')]"],
            then: {
                field: "[x-ms-azure-resource]",
                function: truthy,
            },
        },
        XmsClientName: {
            description: "The 'x-ms-client-name' extension is used to change the name of a parameter or property in the generated code. By using the 'x-ms-client-name' extension, a name can be defined for use specifically in code generation, separately from the name on the wire. It can be used for query parameters and header parameters, as well as properties of schemas. This name is case sensitive.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths']..?(@property === 'x-ms-client-name')^"],
            then: {
                function: xmsClientName,
            },
        },
        XmsPathsMustOverloadPaths: {
            description: "The `x-ms-paths` extension allows us to overload an existing path based on path parameters. We cannot specify an `x-ms-paths` without a path that already exists in the `paths` section.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$['x-ms-paths']"],
            then: {
                function: xmsPathsMustOverloadPaths,
            },
        },
        XmsExamplesRequired: {
            description: "Verifies whether `x-ms-examples` are provided for each operation or not.",
            message: "Please provide x-ms-examples describing minimum/maximum property set for response/request payloads for operations.",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[get,put,post,patch,delete,options,head]"],
            then: {
                function: xmsExamplesRequired,
            },
        },
        XmsClientNameParameter: {
            description: "The `x-ms-client-name` extension is used to change the name of a parameter or property in the generated code. " +
                "By using the `x-ms-client-name` extension, a name can be defined for use specifically in code generation, separately from the name on the wire. " +
                "It can be used for query parameters and header parameters, as well as properties of schemas. This name is case sensitive.",
            message: "Value of `x-ms-client-name` cannot be the same as Property/Model.",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: [
                "$.paths.*[get,put,post,patch,delete,options,head].parameters[?(@.name && @['x-ms-client-name'])]",
                "$.paths.*.parameters[?(@.name && @['x-ms-client-name'])]",
                "$.parameters[?(@.name && @['x-ms-client-name'])]",
            ],
            then: {
                function: xmsClientNameParameter,
            },
        },
        XmsClientNameProperty: {
            description: "The `x-ms-client-name` extension is used to change the name of a parameter or property in the generated code." +
                "By using the `x-ms-client-name` extension, a name can be defined for use specifically in code generation, separately from the name on the wire." +
                "It can be used for query parameters and header parameters, as well as properties of schemas. This name is case sensitive.",
            message: "Value of `x-ms-client-name` cannot be the same as Property/Model.",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$.definitions[*].properties.*['x-ms-client-name']"],
            then: {
                function: xmsClientNameProperty,
            },
        },
        ListInOperationName: {
            description: "Verifies whether value for `operationId` is named as per ARM guidelines when response contains array of items.",
            message: 'Since operation response has model definition in array type, it should be of the form "_list".',
            severity: "warn",
            resolved: true,
            formats: [oas2],
            given: ["$.paths.*[get,post]"],
            then: {
                function: listInOperationName,
            },
        },
        DescriptiveDescriptionRequired: {
            description: "The value of the 'description' property must be descriptive. It cannot be spaces or empty description.",
            message: "The value provided for description is not descriptive enough. Accurate and descriptive description is essential for maintaining reference documentation.",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$..[?(@object() && @.description)].description"],
            then: {
                function: descriptiveDescriptionRequired,
            },
        },
        ParameterDescriptionRequired: {
            description: "The value of the 'description' property must be descriptive. It cannot be spaces or empty description.",
            message: "'{{property}}' parameter lacks 'description' property. Consider adding a 'description' element. Accurate description is essential for maintaining reference documentation.",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$.parameters.*"],
            then: {
                function: descriptiveDescriptionRequired,
            },
        },
        DefaultInEnum: {
            description: "This rule applies when the value specified by the default property does not appear in the enum constraint for a schema.",
            message: "Default value should appear in the enum constraint for a schema",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: "$..[?(@object() && @.enum)]",
            then: {
                function: defaultInEnum,
            },
        },
        EnumInsteadOfBoolean: {
            description: "Booleans properties are not descriptive in all cases and can make them to use, evaluate whether is makes sense to keep the property as boolean or turn it into an enum.",
            message: "Booleans properties are not descriptive in all cases and can make them to use, evaluate whether is makes sense to keep the property as boolean or turn it into an enum.",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: "$..[?(@object() && @.type === 'boolean')]",
            then: {
                function: enumInsteadOfBoolean,
            },
        },
        AvoidAnonymousParameter: {
            description: 'Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.',
            message: 'Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.',
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$.paths[*].parameters.*.schema", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*.schema"],
            then: {
                function: avoidAnonymousSchema,
            },
        },
        AvoidAnonymousTypes: {
            description: "This rule appears when you define a model type inline, rather than in the definitions section. If the model represents the same type as another parameter in a different operation, then it becomes impossible to reuse that same class for both operations.",
            message: 'Inline/anonymous models must not be used, instead define a schema with a model name in the "definitions" section and refer to it. This allows operations to share the models.',
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: [
                "$.paths[*].*.responses.*.schema",
                "$.definitions..additionalProperties[?(@property === 'type' && @ === 'object')]^",
                "$.definitions..allOf[?(@property === 'type' && @ === 'object')]^",
            ],
            then: {
                function: avoidAnonymousSchema,
            },
        },
        AvoidNestedProperties: {
            description: "Nested properties can result into bad user experience especially when creating request objects. `x-ms-client-flatten` flattens the model properties so that the users can analyze and set the properties much more easily.",
            message: "Consider using x-ms-client-flatten to provide a better end user experience",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$..[?(@object() && @.properties)].properties[?(@object() && @.properties)].properties^"],
            then: {
                field: "x-ms-client-flatten",
                function: truthy,
            },
        },
        AvoidMsdnReferences: {
            description: 'The documentation is being generated from the OpenAPI(swagger) and published at "docs.microsoft.com". From that perspective, documentation team would like to avoid having links to the "msdn.microsoft.com" in the OpenAPI(swagger) and SDK documentations.',
            message: 'For better generated code quality, remove all references to "msdn.microsoft.com".',
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$..[?(@property === 'externalDocs')].", "$.info.description"],
            then: {
                function: avoidMsdnReferences,
            },
        },
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
        /^.*\/providers\/microsoft\.\w+\/\w+\/{\w+}(?:\/\w+\/(?!default)\w+){1,2}$/gi,
        /^.*\/providers\/microsoft\.\w+(?:\/\w+\/(default|{\w+})){1,2}(?:\/\w+\/(?!default)\w+)+$/gi,
        /^.*\/providers\/microsoft\.\w+\/\w+\/(?:\/\w+\/(default|{\w+})){0,3}{\w+}(?:\/{\w+})+.*$/gi,
        /^.*\/providers\/microsoft\.\w+(?:\/\w+\/(default|{\w+})){0,2}(?:\/\w+\/(?!default)\w+)+\/{\w+}.*$/gi,
    ];
    return notMatchPatterns(patterns, path);
}
const verifyArmPath = createRulesetFunction({
    input: null,
    options: {
        type: "object",
        properties: {
            segmentToCheck: {
                oneOf: [
                    {
                        type: "string",
                        enum: ["resourceGroupParam", "subscriptionIdParam", "resourceType", "nestedResourceType", "resourceGroupScope"],
                    },
                    {
                        type: "array",
                        items: {
                            type: "string",
                            enum: ["resourceGroupParam", "subscriptionIdParam", "resourceType", "nestedResourceType", "resourceGroupScope"],
                        },
                    },
                ],
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

function camelCase(propertyName, options, { path }) {
    if (!propertyName) {
        return [];
    }
    const errors = [];
    const camelCaseReg = /^[a-z0-9$-]+([A-Z]{1,3}[a-z0-9$-]+)+$|^[a-z0-9$-]+$|^[a-z0-9$-]+([A-Z]{1,3}[a-z0-9$-]+)*[A-Z]{1,3}$/;
    if (!camelCaseReg.test(propertyName)) {
        errors.push({
            message: "",
            path
        });
    }
    return errors;
}

const collectionObjectPropertiesNaming = (op, _opts, paths) => {
    var _a, _b;
    if (op === null || typeof op !== "object") {
        return [];
    }
    const path = paths.path || [];
    const errors = [];
    const regex = /.+_List([^_]*)$/;
    if (op && regex.test(op.operationId) && isPageableOperation(op)) {
        const schema = (_b = (_a = op.responses) === null || _a === void 0 ? void 0 : _a["200"]) === null || _b === void 0 ? void 0 : _b.schema;
        const valueSchema = getProperty(schema, "value");
        if (schema && !(valueSchema && valueSchema.type === "array")) {
            errors.push({
                message: `Collection object returned by list operation '${op.operationId}' with 'x-ms-pageable' extension, has no property named 'value'.`,
                path: path.concat(['responses', "200", "schema"])
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
                message: `The property '${absent}' in the request body either not apppear in the resource model or has the wrong level.`,
                path: [...path, "parameters", patchBodySchemaIndex, "schema"],
            });
        });
    }
    return errors;
};

const SYNC_DELETE_RESPONSES = ["200", "204", "default"];
const LR_DELETE_RESPONSES = ["202", "204", "default"];
const SYNC_ERROR = "Synchronous delete operations must have responses with 200, 204 and default return codes. They also must have no other response codes.";
const LR_ERROR = "Long-running (LRO) delete operations must have responses with 202, 204 and default return codes. They also must have no other response codes.";
const EmptyResponse_ERROR = "Delete operation response codes MUST be non-empty. It MUST have response codes 200, 204 and default if it is sync OR 202, 204 and default if it is long running.";
const DeleteResponseCodes = (deleteOp, _opts, ctx) => {
    var _a;
    if (deleteOp === null || typeof deleteOp !== "object") {
        return [];
    }
    const path = ctx.path;
    const errors = [];
    if (!(deleteOp === null || deleteOp === void 0 ? void 0 : deleteOp.responses) || (deleteOp === null || deleteOp === void 0 ? void 0 : deleteOp.responses.length) == 0) {
        errors.push({
            message: EmptyResponse_ERROR,
            path: path,
        });
        return errors;
    }
    const responses = Object.keys((_a = deleteOp === null || deleteOp === void 0 ? void 0 : deleteOp.responses) !== null && _a !== void 0 ? _a : {});
    if (responses.length == 0) {
        errors.push({
            message: EmptyResponse_ERROR,
            path: path,
        });
        return errors;
    }
    const isAsyncOperation = deleteOp.responses["202"] ||
        (deleteOp["x-ms-long-running-operation"] && deleteOp["x-ms-long-running-operation"] === true) ||
        deleteOp["x-ms-long-running-operation-options"];
    if (isAsyncOperation) {
        if (!deleteOp["x-ms-long-running-operation"]) {
            errors.push({
                message: "An async DELETE operation must set '\"x-ms-long-running-operation\" : true'.",
                path: path,
            });
            return errors;
        }
        if (responses.length !== LR_DELETE_RESPONSES.length || !LR_DELETE_RESPONSES.every((value) => responses.includes(value))) {
            errors.push({
                message: LR_ERROR,
                path: path,
            });
        }
    }
    else {
        if (responses.length !== SYNC_DELETE_RESPONSES.length || !SYNC_DELETE_RESPONSES.every((value) => responses.includes(value))) {
            errors.push({
                message: SYNC_ERROR,
                path: path,
            });
        }
    }
    return errors;
};

const longRunningResponseStatusCode = (methodOp, _opts, ctx, validResponseCodesList) => {
    var _a, _b, _c, _d;
    if (methodOp === null || typeof methodOp !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const method = Object.keys(methodOp)[0];
    if (!["delete", "put", "patch", "post"].includes(method)) {
        return [];
    }
    const operationId = ((_a = methodOp === null || methodOp === void 0 ? void 0 : methodOp[method]) === null || _a === void 0 ? void 0 : _a.operationId) || "";
    if (!((_b = methodOp === null || methodOp === void 0 ? void 0 : methodOp[method]) === null || _b === void 0 ? void 0 : _b["x-ms-long-running-operation"])) {
        return [];
    }
    if ((_c = methodOp === null || methodOp === void 0 ? void 0 : methodOp[method]) === null || _c === void 0 ? void 0 : _c.responses) {
        const responseCodes = Object.keys((_d = methodOp === null || methodOp === void 0 ? void 0 : methodOp[method]) === null || _d === void 0 ? void 0 : _d.responses);
        const validResponseCodes = validResponseCodesList[method];
        const validResponseCodeString = validResponseCodes.join(" or ");
        const withTerminalCode = validResponseCodes.some((code) => responseCodes.includes(code));
        if (!withTerminalCode) {
            errors.push({
                message: `A '${method}' operation '${operationId}' with x-ms-long-running-operation extension must have a valid terminal success status code ${validResponseCodeString}.`,
                path: [...path, method],
            });
        }
    }
    return errors;
};
const longRunningResponseStatusCodeArm = (methodOp, _opts, ctx) => {
    const validResponseCodesList = {
        delete: ["200", "204"],
        post: ["200", "201", "202", "204"],
        put: ["200", "201"],
        patch: ["200", "201", "202"],
    };
    return longRunningResponseStatusCode(methodOp, _opts, ctx, validResponseCodesList);
};

const getCollectionOnlyHasValueAndNextLink = (properties, _opts, ctx) => {
    if (!properties || typeof properties !== "object") {
        return [];
    }
    const keys = Object.keys(properties);
    if (keys.length != 2 || !keys.includes("value") || !keys.includes("nextLink")) {
        return [
            {
                message: "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model.",
            },
        ];
    }
    return [];
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

const httpsSupportedScheme = (scheme, _opts, paths) => {
    if (scheme == null || typeof scheme !== "object")
        return [];
    const schemeArray = scheme;
    if (schemeArray[0] === "https" && schemeArray.length === 1)
        return [];
    const path = paths.path || [];
    return [{
            message: 'Azure Resource Management only supports HTTPS scheme.',
            path,
        }];
};

const locationMustHaveXmsMutability = (scheme, _opts, paths) => {
    if (scheme == null || typeof scheme !== "object")
        return [];
    if (scheme["x-ms-mutability"] !== undefined && Array.isArray(scheme["x-ms-mutability"])) {
        const schemeArray = scheme["x-ms-mutability"];
        if (schemeArray.includes("create") && schemeArray.includes("read"))
            return [];
    }
    const path = paths.path || [];
    return [{
            message: 'Property \'location\' must have \'\\"x-ms-mutability\\":[\\"read\\", \\"create\\"]\' extension defined.',
            path,
        }];
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

const provisioningStateSpecifiedForLROPatch = (patchOp, _opts, ctx) => {
    if (patchOp === null || typeof patchOp !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const allProperties = getProperties(patchOp.schema);
    const provisioningStateProperty = getProperty(allProperties === null || allProperties === void 0 ? void 0 : allProperties.properties, "provisioningState");
    if (provisioningStateProperty === undefined || Object.keys(provisioningStateProperty).length === 0) {
        errors.push({
            message: `200 response schema in long running PATCH operation is missing ProvisioningState property. A LRO PATCH operations 200 response schema must have ProvisioningState specified.`,
            path,
        });
    }
    return errors;
};

const LROPostFinalStateViaProperty = (postOp, _opts, ctx) => {
    if (postOp === null || typeof postOp !== "object") {
        return [];
    }
    const path = ctx.path;
    const errors = [];
    const errorMessage = "A long running operation (LRO) post MUST have 'long-running-operation-options' specified and MUST have the 'final-state-via' property set to 'azure-async-operation'.";
    if (!postOp["x-ms-long-running-operation"] || postOp["x-ms-long-running-operation"] !== true) {
        return [];
    }
    if (!postOp["x-ms-long-running-operation-options"]) {
        errors.push({
            message: errorMessage,
            path: path,
        });
        return errors;
    }
    const finalStateViaProperty = postOp["x-ms-long-running-operation-options"]["final-state-via"];
    if (!finalStateViaProperty || finalStateViaProperty !== "azure-async-operation") {
        errors.push({
            message: errorMessage,
            path: path,
        });
    }
    return errors;
};

const lroPostReturn = (postOp, _opts, ctx) => {
    if (postOp === null || typeof postOp !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const responses = postOp.responses;
    if (responses && (!responses["200"] || !responses["202"])) {
        errors.push({
            message: "A LRO POST operation must have both 200 & 202 return codes.",
            path: path,
        });
    }
    if (responses["200"] && !responses["200"].schema) {
        errors.push({
            message: "200 response for a LRO POST operation must have a response schema specified.",
            path,
        });
    }
    if (responses["202"] && responses["202"].schema) {
        errors.push({
            message: "202 response for a LRO POST operation must not have a response schema specified.",
            path,
        });
    }
    return errors;
};

const provisioningStateSpecifiedForLROPut = (putOp, _opts, ctx) => {
    var _a;
    if (putOp === null || typeof putOp !== "object") {
        return [];
    }
    const putCodes = ["200", "201"];
    const path = ctx.path || [];
    const errors = [];
    for (const code of putCodes) {
        const allProperties = getProperties((_a = putOp.responses[code]) === null || _a === void 0 ? void 0 : _a.schema);
        const provisioningStateProperty = getProperty(allProperties === null || allProperties === void 0 ? void 0 : allProperties.properties, "provisioningState");
        if (provisioningStateProperty === undefined || Object.keys(provisioningStateProperty).length === 0) {
            errors.push({
                message: `${code} response schema in long running PUT operation is missing ProvisioningState property. A LRO PUT operations response schema must have ProvisioningState specified for the 200 and 201 status codes.`,
                path,
            });
        }
    }
    return errors;
};

const scopeParameter = "{scope}";
const noDuplicatePathsForScopeParameter = (path, _opts, ctx) => {
    var _a;
    const swagger = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.documentInventory) === null || _a === void 0 ? void 0 : _a.resolved;
    if (path === null || typeof path !== "string" || path.length === 0 || swagger === null) {
        return [];
    }
    const pathRegEx = new RegExp(path.replace(scopeParameter, ".*"));
    const otherPaths = Object.keys(swagger.paths).filter((p) => p !== path);
    const matches = otherPaths.filter((p) => pathRegEx.test(p));
    const errors = matches.map((match) => {
        return {
            message: `Path "${match}" with explicitly defined scope is a duplicate of path "${path}" that has the scope parameter.".`,
            path: ctx.path,
        };
    });
    return errors;
};

const ALLOWED_RESPONSE_CODES = ["200", "201", "202", "204", "default"];
const noErrorCodeResponses = (responseCode, _opts, ctx) => {
    var _a;
    if (!responseCode || typeof responseCode !== "string") {
        return [];
    }
    if (ALLOWED_RESPONSE_CODES.some((allowedCode) => responseCode === allowedCode)) {
        return [];
    }
    return [
        {
            message: "",
            path: (_a = ctx.path) !== null && _a !== void 0 ? _a : [],
        },
    ];
};

function operationsApiSchema(schema, options, { path }) {
    if (schema === null || typeof schema !== "object") {
        return [];
    }
    const errors = [];
    let isValid = true;
    const value = getProperty(schema, "value");
    const items = value === null || value === void 0 ? void 0 : value.items;
    if (value && items) {
        const name = getProperty(items, "name");
        const display = getProperty(items, "display");
        const isDataAction = getProperty(items, "isDataAction");
        if (!name || !isDataAction || !display) {
            isValid = false;
        }
        else {
            if (["description", "provider", "operation", "resource"].some((e) => !getProperty(display, e))) {
                isValid = false;
            }
        }
    }
    else {
        isValid = false;
    }
    if (!isValid) {
        errors.push({
            message: path[1],
            path,
        });
    }
    return errors;
}

const OPERATIONS = "/operations";
const GET = "get";
const NOT_TENANT_LEVEL_REGEX = /\/subscriptions\/\{.*\}\/(?:resourceGroups\/\{.*\}\/)?providers\/[^/]+\/operations/;
const operationsApiTenantLevelOnly = (pathItem, _opts, ctx) => {
    if (pathItem === null || typeof pathItem !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const keys = Object.keys(pathItem);
    if (keys.length < 1) {
        return [];
    }
    const errors = [];
    for (const pathName of keys) {
        if (pathItem[pathName][GET] && pathName.toString().endsWith(OPERATIONS) && pathName.match(NOT_TENANT_LEVEL_REGEX)) {
            errors.push({
                message: "The get operations endpoint for the operations API must only be at the tenant level.",
                path: [...path, pathName, GET],
            });
        }
    }
    return errors;
};

const pushToError = (errors, parameter, path) => {
    errors.push({
        message: `Parameter "${parameter}" is referenced but not defined in the global parameters section of Service Definition`,
        path: [...path],
    });
};
const parameterNotDefinedInGlobalParameters = (parameters, _opts, ctx) => {
    var _a;
    if (parameters === null || !Array.isArray(parameters)) {
        return [];
    }
    if (parameters.length === 0) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const globalParametersList = [];
    const swagger = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.documentInventory) === null || _a === void 0 ? void 0 : _a.resolved;
    if (swagger.parameters) {
        for (const parameters in swagger.parameters) {
            const parameterName = swagger.parameters[parameters].name;
            globalParametersList.push(parameterName);
        }
        for (const parameter of parameters) {
            if (parameter.name && parameter.name === "subscriptionId" && !globalParametersList.includes("subscriptionId")) {
                pushToError(errors, "subscriptionId", path);
            }
        }
        const commonTypeApiVersionReg = /.*common-types\/resource-management\/v\d\/types\.json#\/parameters\/ApiVersionParameter/gi;
        if (!globalParametersList.includes("api-version") && !parameters.some((p) => p.$ref && commonTypeApiVersionReg.test(p.$ref))) {
            pushToError(errors, "api-version", path);
        }
    }
    return errors;
};

const parameterNotUsingCommonTypes = (parameters, _opts, ctx) => {
    var _a, _b;
    if (parameters === null || !Array.isArray(parameters)) {
        return [];
    }
    if (parameters.length === 0) {
        return [];
    }
    const commonTypesParametersNames = new Set([
        "subscriptionId",
        "api-version",
        "resourceGroupName",
        "operationId",
        "location",
        "managementGroupName",
        "scope",
        "tenantId",
        "ifMatch",
        "ifNoneMatch",
    ]);
    const swagger = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.documentInventory) === null || _a === void 0 ? void 0 : _a.resolved;
    const allParams = parameters.concat(Object.values((_b = swagger === null || swagger === void 0 ? void 0 : swagger.parameters) !== null && _b !== void 0 ? _b : []));
    const paramsWithNameProperty = allParams.filter((param) => Object.keys(param).includes("name"));
    const paramNames = paramsWithNameProperty.map((param) => param.name);
    const paramsFromCommonTypes = paramNames.filter((pName) => commonTypesParametersNames.has(pName));
    const errors = paramsFromCommonTypes.map((pName) => {
        return {
            message: `Not using the common-types defined parameter "${pName}".`,
            path: ctx.path,
        };
    });
    return errors;
};

const ParametersInPointGet = (pathItem, _opts, ctx) => {
    if (pathItem === null || typeof pathItem !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const uris = Object.keys(pathItem);
    if (uris.length < 1) {
        return [];
    }
    const GET = "get";
    const errors = [];
    for (const uri of uris) {
        const hierarchy = getResourcesPathHierarchyBasedOnResourceType(uri);
        if (hierarchy.length >= 1 && pathItem[uri][GET]) {
            const params = pathItem[uri][GET]["parameters"];
            const queryParams = params.filter((param) => param.in === "query" && param.name !== "api-version");
            queryParams.map((param) => {
                errors.push({
                    message: `Query parameter ${param.name} should be removed. Point Get's MUST not have query parameters other than api version.`,
                    path: [path, uri, GET, "parameters"],
                });
            });
        }
    }
    return errors;
};

const ParametersInPost = (postParameters, _opts, ctx) => {
    if (postParameters === null || !Array.isArray(postParameters)) {
        return [];
    }
    if (postParameters.length === 0) {
        return [];
    }
    const path = ctx.path;
    const queryParams = postParameters.filter((param) => param.in === "query" && param.name !== "api-version");
    const errors = queryParams.map((param) => {
        return {
            message: `${param.name} is a query parameter. Post operation must not contain any query parameter other than api-version.`,
            path: path,
        };
    });
    return errors;
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

const PatchResponseCode = (patchOp, _opts, ctx) => {
    if (patchOp === null || typeof patchOp !== "object") {
        return [];
    }
    const path = ctx.path;
    const errors = [];
    if (patchOp["x-ms-long-running-operation"] && patchOp["x-ms-long-running-operation"] === true) {
        if ((patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses) && !((patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses["200"]) && (patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses["202"]))) {
            errors.push({
                message: "LRO PATCH must have 200 and 202 return codes.",
                path: path,
            });
        }
    }
    else {
        if ((patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses) && !(patchOp === null || patchOp === void 0 ? void 0 : patchOp.responses["200"])) {
            errors.push({
                message: "Synchronous PATCH must have 200 return code.",
                path: path,
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

const errorMessageObject = "Properties with type:object that don't reference a model definition are not allowed. ARM doesn't allow generic type definitions as this leads to bad customer experience.";
const errorMessageNull = "Properties with type NULL are not allowed. Either specify the type as object and reference a model or specify a primitive type.";
const propertiesTypeObjectNoDefinition = (definitionObject, opts, ctx) => {
    const path = ctx.path || [];
    const errors = [];
    if ((definitionObject === null || definitionObject === void 0 ? void 0 : definitionObject.type) === "") {
        errors.push({ message: errorMessageNull, path });
    }
    const values = Object.values(definitionObject);
    for (const val of values) {
        if (typeof val === "object")
            return [];
        else
            continue;
    }
    if ((definitionObject === null || definitionObject === void 0 ? void 0 : definitionObject.type) === "object") {
        errors.push({ message: errorMessageObject, path });
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

const provisioningStateMustBeReadOnly = (schema, _opts, ctx) => {
    if (schema === null || typeof schema !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const allProperties = getProperties(schema);
    const provisioningStateProperty = getProperty(allProperties === null || allProperties === void 0 ? void 0 : allProperties.properties, "provisioningState");
    if (provisioningStateProperty === undefined || Object.keys(provisioningStateProperty).length === 0) {
        return [];
    }
    const provisioningStatePropertyReadOnly = provisioningStateProperty["readOnly"];
    if (!provisioningStatePropertyReadOnly || provisioningStatePropertyReadOnly !== true) {
        errors.push({
            message: "provisioningState property must be set to readOnly.",
            path,
        });
    }
    return errors;
};

const putGetPatchScehma = (pathItem, opts, ctx) => {
    if (pathItem === null || typeof pathItem !== 'object') {
        return [];
    }
    const neededHttpVerbs = ["put", "get", "patch"];
    const path = ctx.path || [];
    const errors = [];
    const models = new Set();
    for (const verb of neededHttpVerbs) {
        if (pathItem[verb]) {
            models.add(getReturnedType(pathItem[verb]));
        }
        if (models.size > 1) {
            errors.push({
                message: "",
                path
            });
            break;
        }
    }
    return errors;
};

const putRequestResponseScheme = (putOp, _opts, ctx) => {
    var _a;
    if (putOp === null || typeof putOp !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    if (!putOp.parameters) {
        return [];
    }
    let reqBodySchema = {};
    let reqBodySchemaPath = "";
    for (let i = 0; i < putOp.parameters.length; i++) {
        const parameter = putOp.parameters[i];
        if (parameter.in === "body") {
            reqBodySchemaPath = `parameters[${i}].schema`;
            reqBodySchema = parameter.schema ? parameter.schema : {};
            break;
        }
    }
    if (Object.keys(reqBodySchema).length === 0) {
        return [];
    }
    const responseCode = putOp.responses["200"] ? "200" : "201";
    const respModelPath = `responses[${responseCode}].schema`;
    const respModel = ((_a = putOp.responses[responseCode]) === null || _a === void 0 ? void 0 : _a.schema)
        ? putOp.responses[responseCode].schema
        : {};
    if (!isSchemaEqual(reqBodySchema, respModel)) {
        errors.push({
            message: `A PUT operation request body schema should be the same as its 200 response schema, to allow reusing the same entity between GET and PUT. If the schema of the PUT request body is a superset of the GET response body, make sure you have a PATCH operation to make the resource updatable. Operation: '${putOp.operationId}' Request Model: '${reqBodySchemaPath}' Response Model: '${respModelPath}'`,
            path: [...path],
        });
    }
    return errors;
};

const PutResponseSchemaDescription = (putResponseSchema, opts, ctx) => {
    var _a, _b;
    if (putResponseSchema === null || typeof putResponseSchema !== "object") {
        return [];
    }
    const path = ctx.path;
    const errors = [];
    if (!putResponseSchema["200"] || !putResponseSchema["201"]) {
        errors.push({
            message: "Any Put MUST contain 200 and 201 return codes.",
            path: path,
        });
        return errors;
    }
    if (!((_a = putResponseSchema["200"].description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("update"))) {
        errors.push({
            message: 'Description of 200 response code of a PUT operation MUST include term "update".',
            path: path,
        });
    }
    if (!((_b = putResponseSchema["201"].description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("create"))) {
        errors.push({
            message: 'Description of 201 response code of a PUT operation MUST include term "create".',
            path: path,
        });
    }
    return errors;
};

const ARM_ALLOWED_RESERVED_NAMES = ["operations"];
const INCLUDED_OPERATIONS = ["get", "put", "delete", "patch"];
const reservedResourceNamesModelAsEnum = (pathItem, _opts, ctx) => {
    var _a;
    if (pathItem === null || typeof pathItem !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const keys = Object.keys(pathItem);
    if (keys.length < 1) {
        return [];
    }
    const pathName = keys[0];
    if (!pathName.match(/.*\/\w+s\/\w+$/)) {
        return [];
    }
    const lastPathWord = (_a = pathName.split("/").pop()) !== null && _a !== void 0 ? _a : "";
    if (ARM_ALLOWED_RESERVED_NAMES.includes(lastPathWord)) {
        return [];
    }
    const errors = [];
    for (const op of INCLUDED_OPERATIONS) {
        if (pathItem[pathName][op]) {
            errors.push({
                message: `The service-defined (reserved name) resource "${lastPathWord}" must be represented as a path parameter enum with \`modelAsString\` set to \`true\`.`,
                path: [...path, pathName, op],
            });
        }
    }
    return errors;
};

const RESOURCE_COMMON_TYPES_REGEX = /.*common-types\/resource-management\/v\d+\/types.json#\/definitions\/(Proxy|Tracked)Resource/;
const resourceMustReferenceCommonTypes = (ref, _opts, ctx) => {
    var _a, _b, _c, _d;
    if (!ref) {
        return [];
    }
    const swagger = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.documentInventory) === null || _a === void 0 ? void 0 : _a.resolved;
    const definitions = swagger === null || swagger === void 0 ? void 0 : swagger.definitions;
    if (!definitions) {
        return [];
    }
    const resourceName = ref.toString().split("/").pop();
    const allOfRef = (_c = (_b = definitions[resourceName]) === null || _b === void 0 ? void 0 : _b.properties) === null || _c === void 0 ? void 0 : _c.allOf;
    const path = ["definitions", resourceName];
    const error = [
        {
            message: `Resource definition '${resourceName}' must reference the common types resource definition for ProxyResource or TrackedResource.`,
            path: path,
        },
    ];
    if (!allOfRef) {
        return error;
    }
    for (const refObj of allOfRef) {
        if ((_d = refObj.$ref) === null || _d === void 0 ? void 0 : _d.match(RESOURCE_COMMON_TYPES_REGEX)) {
            return [];
        }
    }
    return error;
};

const resourceNameRestriction = (paths, _opts, ctx) => {
    if (paths === null || typeof paths !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    function getPathParameter(pathItem, paramName) {
        let parameters = [];
        const method = Object.keys(pathItem).find((k) => k !== "parameters");
        if (method) {
            const operationParameters = pathItem[method].parameters;
            parameters = parameters.concat(operationParameters);
        }
        if (pathItem.parameters) {
            parameters = parameters.concat(pathItem.parameters);
        }
        return parameters.find((p) => p.in === "path" && p.name === paramName);
    }
    for (const pathKey of Object.keys(paths)) {
        const parts = pathKey.split("/").slice(1);
        parts.forEach((v, i) => {
            var _a;
            if (v.includes("}")) {
                const param = (_a = v.match(/[^{}]+(?=})/)) === null || _a === void 0 ? void 0 : _a[0];
                if ((param === null || param === void 0 ? void 0 : param.match(/^\w+Name+$/)) && param !== "resourceGroupName") {
                    const paramDefinition = getPathParameter(paths[pathKey], param);
                    if (paramDefinition && !paramDefinition.pattern) {
                        errors.push({
                            message: `The resource name parameter '${param}' should be defined with a 'pattern' restriction.`,
                            path: [...path, pathKey],
                        });
                    }
                }
            }
        });
    }
    return errors;
};

const responseSchemaSpecifiedForSuccessStatusCode = (putOperation, _opts, ctx) => {
    const errors = [];
    const path = ctx.path;
    const successCodes = ["200", "201"];
    for (const code of successCodes) {
        if (putOperation.responses[code]) {
            const response = putOperation.responses[code];
            if (!response.schema) {
                errors.push({
                    message: `The ${code} success status code has missing response schema. 200 and 201 success status codes for an ARM PUT operation must have a response schema specified.`,
                    path,
                });
            }
        }
    }
    return errors;
};

const securityDefinitionsStructure = (swagger, _opts) => {
    var _a, _b, _c, _d, _e, _f;
    if (swagger === "" || typeof swagger !== "object") {
        return [];
    }
    if (!Object.keys(swagger).includes("securityDefinitions")) {
        return [];
    }
    const errors = [];
    const securityDefinition = swagger.securityDefinitions;
    let likeModule = false;
    if (((_a = securityDefinition === null || securityDefinition === void 0 ? void 0 : securityDefinition.azure_auth) === null || _a === void 0 ? void 0 : _a.type) === "oauth2" &&
        ((_b = securityDefinition === null || securityDefinition === void 0 ? void 0 : securityDefinition.azure_auth) === null || _b === void 0 ? void 0 : _b.authorizationUrl) ===
            "https://login.microsoftonline.com/common/oauth2/authorize" &&
        ((_c = securityDefinition === null || securityDefinition === void 0 ? void 0 : securityDefinition.azure_auth) === null || _c === void 0 ? void 0 : _c.flow) === "implicit" &&
        ((_d = securityDefinition === null || securityDefinition === void 0 ? void 0 : securityDefinition.azure_auth) === null || _d === void 0 ? void 0 : _d.description) &&
        ((_f = (_e = securityDefinition === null || securityDefinition === void 0 ? void 0 : securityDefinition.azure_auth) === null || _e === void 0 ? void 0 : _e.scopes) === null || _f === void 0 ? void 0 : _f.user_impersonation)) {
        likeModule = true;
    }
    if (!likeModule) {
        errors.push({
            message: `Every OpenAPI(swagger) spec/configuration must have a security definitions section and it must adhere to the following structure: https://github.com/Azure/azure-openapi-validator/blob/main/docs/security-definitions-structure-validation.md`,
        });
    }
    return errors;
};

const skuValidation = (skuSchema, opts, paths) => {
    if (skuSchema === null || typeof skuSchema !== 'object') {
        return [];
    }
    const path = paths.path || [];
    const errors = [];
    const propertiesRegEx = /^(NAME|TIER|SIZE|FAMILY|CAPACITY)$/i;
    const properties = getProperties(skuSchema);
    const message = {
        message: `A Sku model must have 'name' property. It can also have 'tier', 'size', 'family', 'capacity' as optional properties.`,
        path,
    };
    if (!properties) {
        errors.push(message);
        return errors;
    }
    if (!Object.keys(properties).includes('name')) {
        errors.push(message);
        return errors;
    }
    for (const prop of Object.entries(properties)) {
        if (!propertiesRegEx.test(prop[0])) {
            errors.push(message);
            break;
        }
        if (prop[0].toLowerCase() === "name") {
            if (prop[1].type !== "string") {
                errors.push(message);
            }
        }
    }
    return errors;
};

const SyncPostReturn = (postOp, _opts, ctx) => {
    if (postOp === null || typeof postOp !== "object") {
        return [];
    }
    if (postOp["x-ms-long-running-operation"] && postOp["x-ms-long-running-operation"] === true) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const responses = postOp.responses;
    if (responses && (!(responses["200"] || responses["204"]) || !!(responses["200"] && responses["204"]))) {
        errors.push({
            message: "A synchronous POST operation must have either 200 or 204 return codes.",
            path: path,
        });
    }
    if (responses["200"] && !responses["200"].schema) {
        errors.push({
            message: "200 response for a synchronous POST operation must have a response schema specified.",
            path,
        });
    }
    if (responses["204"] && responses["204"].schema) {
        errors.push({
            message: "204 response for a synchronous POST operation must not have a response schema specified.",
            path,
        });
    }
    return errors;
};

const trackedResourceTagsPropertyInRequest = (pathItem, _opts, paths) => {
    if (pathItem === null || typeof pathItem !== "object") {
        return [];
    }
    const path = paths.path || [];
    const errors = [];
    const pathParams = pathItem.parameters || [];
    if (pathItem["put"] && Array.isArray(pathItem["put"].parameters)) {
        const allParams = [...pathParams, ...pathItem["put"].parameters];
        const bodyParam = allParams.find((p) => p.in === "body");
        if (bodyParam) {
            const properties = getProperties(bodyParam.schema);
            const requiredProperties = getRequiredProperties(bodyParam.schema);
            if ("location" in properties) {
                if ("tags" in properties) {
                    if (requiredProperties.includes("tags")) {
                        errors.push({
                            message: `Tags must not be a required property.`,
                            path: [...path, "put"]
                        });
                    }
                }
                else {
                    errors.push({
                        message: `Tracked resource does not have tags in the request schema.`,
                        path: [...path, "put"],
                    });
                }
            }
        }
    }
    return errors;
};

const validatePatchBodyParamProperties = createRulesetFunction({
    input: null,
    options: {
        type: "object",
        properties: {
            should: {
                type: "array",
                items: {
                    type: "string",
                },
            },
            shouldNot: {
                type: "array",
                items: {
                    type: "string",
                },
            },
        },
        additionalProperties: false,
    },
}, (patchOp, _opts, ctx) => {
    var _a, _b, _c, _d, _e, _f;
    if (patchOp === null || typeof patchOp !== "object") {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const bodyParameter = (_b = (_a = patchOp.parameters) === null || _a === void 0 ? void 0 : _a.find((p) => p.in === "body")) === null || _b === void 0 ? void 0 : _b.schema;
    if (bodyParameter) {
        const index = patchOp.parameters.findIndex((p) => p.in === "body");
        if (_opts.should) {
            const responseSchema = ((_d = (_c = patchOp.responses) === null || _c === void 0 ? void 0 : _c["200"]) === null || _d === void 0 ? void 0 : _d.schema) || ((_f = (_e = patchOp.responses) === null || _e === void 0 ? void 0 : _e["201"]) === null || _f === void 0 ? void 0 : _f.schema) || getGetOperationSchema(path.slice(0, -1), ctx);
            _opts.should.forEach((p) => {
                var _a, _b;
                if (!((_a = getProperties(bodyParameter)) === null || _a === void 0 ? void 0 : _a[p]) && ((_b = getProperties(responseSchema)) === null || _b === void 0 ? void 0 : _b[p])) {
                    errors.push({
                        message: `The patch operation body parameter schema should contain property '${p}'.`,
                        path: [...path, "parameters", index],
                    });
                }
            });
        }
        if (_opts.shouldNot) {
            _opts.shouldNot.forEach((p) => {
                var _a;
                const property = (_a = getProperties(bodyParameter)) === null || _a === void 0 ? void 0 : _a[p];
                if (property) {
                    let isPropertyReadOnly = false;
                    let isPropertyImmutable = false;
                    if (property["readOnly"] && property["readOnly"] === true) {
                        isPropertyReadOnly = true;
                    }
                    if (property["x-ms-mutability"] && Array.isArray(property["x-ms-mutability"])) {
                        const schemaArray = property["x-ms-mutability"];
                        if (!schemaArray.includes("update")) {
                            isPropertyImmutable = true;
                        }
                    }
                    if (!(isPropertyReadOnly || isPropertyImmutable)) {
                        errors.push({
                            message: `Mark the top-level property "${p}", specified in the patch operation body, as readOnly or immutable. You could also choose to remove it from the request payload of the Patch operation. These properties are not patchable.`,
                            path: [...path, "parameters", index],
                        });
                    }
                }
            });
        }
    }
    return errors;
});

const withXmsResource = (putOperation, _opts, ctx) => {
    const errors = [];
    const path = ctx.path;
    const returnSchema = getReturnedSchema(putOperation);
    if (returnSchema && !isXmsResource(returnSchema)) {
        errors.push({
            message: `The 200 response model for an ARM PUT operation must have x-ms-azure-resource extension set to true in its hierarchy.Operation: ${putOperation.operationId}`,
            path
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
        LongRunningResponseStatusCode: {
            description: 'A LRO Post operation with return schema must have "x-ms-long-running-operation-options" extension enabled.',
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-long-running-operation' && @ === true)]^^"],
            then: {
                function: longRunningResponseStatusCodeArm,
            },
        },
        ProvisioningStateSpecifiedForLROPut: {
            description: 'A LRO PUT operation\'s response schema must have "ProvisioningState" property specified for the 200 and 201 status codes.',
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[put][?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
            then: {
                function: provisioningStateSpecifiedForLROPut,
            },
        },
        ProvisioningStateSpecifiedForLROPatch: {
            description: 'A long running Patch operation\'s response schema must have "ProvisioningState" property specified for the 200 status code.',
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: [
                "$[paths,'x-ms-paths'].*[patch][?(@property === 'x-ms-long-running-operation' && @ === true)]^.responses[?(@property == '200')]",
            ],
            then: {
                function: provisioningStateSpecifiedForLROPatch,
            },
        },
        ProvisioningStateValidation: {
            description: "ProvisioningState must have terminal states: Succeeded, Failed and Canceled.",
            message: "{{error}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$.definitions..provisioningState[?(@property === 'enum')]^", "$.definitions..ProvisioningState[?(@property === 'enum')]^"],
            then: {
                function: provisioningState,
            },
        },
        LroLocationHeader: {
            description: "Location header must be supported for all async operations that return 202.",
            message: "A 202 response should include an Location response header.",
            severity: "error",
            formats: [oas2],
            given: "$.paths[*][*].responses[?(@property == '202')]",
            then: {
                function: hasHeader,
                functionOptions: {
                    name: "Location",
                },
            },
        },
        LroErrorContent: {
            description: "Error response content of long running operations must follow the error schema provided in the common types v2 and above.",
            message: "{{description}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-long-running-operation' && @ === true)]^.responses[?(@property === 'default' || @property.startsWith('5') || @property.startsWith('4'))].schema.$ref",
            then: {
                function: pattern,
                functionOptions: {
                    match: ".*/common-types/resource-management/v(([1-9]\\d+)|[2-9])/types.json#/definitions/ErrorResponse",
                },
            },
        },
        DeleteResponseCodes: {
            description: "Synchronous DELETE must have 200 & 204 return codes and LRO DELETE must have 202 & 204 return codes.",
            severity: "error",
            message: "{{error}}",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[delete]"],
            then: {
                function: DeleteResponseCodes,
            },
        },
        DeleteMustNotHaveRequestBody: {
            description: "The delete operation must not have a request body.",
            severity: "error",
            message: "{{description}}",
            resolved: true,
            formats: [oas2],
            given: "$.paths.*.delete.parameters[?(@.in === 'body')]",
            then: {
                function: falsy,
            },
        },
        DeleteResponseBodyEmpty: {
            description: "The delete response body must be empty.",
            message: "{{description}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[delete].responses['200','204'].schema"],
            then: {
                function: falsy,
            },
        },
        AvoidAdditionalProperties: {
            description: "The use of additionalProperties is not allowed except for user defined tags on tracked resources.",
            severity: "error",
            message: "{{description}}",
            resolved: true,
            formats: [oas2],
            given: "$.definitions..[?(@property !== 'tags' && @.additionalProperties)]",
            then: {
                function: falsy,
            },
        },
        PropertiesTypeObjectNoDefinition: {
            description: "Properties with type:object that don't reference a model definition are not allowed. ARM doesn't allow generic type definitions as this leads to bad customer experience.",
            severity: "error",
            message: "{{error}}",
            resolved: true,
            formats: [oas2],
            given: "$.definitions..[?(@property === 'type' && @ ==='object' || @ ==='')]^",
            then: {
                function: propertiesTypeObjectNoDefinition,
            },
        },
        GetMustNotHaveRequestBody: {
            description: "The Get operation must not have a request body.",
            severity: "error",
            message: "{{description}}",
            resolved: true,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*.get.parameters[?(@.in === 'body')]",
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
            given: ["$[paths,'x-ms-paths'].*[get].responses['201','202','203','204']"],
            then: {
                function: falsy,
            },
        },
        GetCollectionOnlyHasValueAndNextLink: {
            description: "Get endpoints for collections of resources must only have the `value` and `nextLink` properties in their model.",
            message: "{{description}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'][?(!@property.endsWith('}') && !@property.endsWith('operations'))][get].responses.200.schema.properties",
            then: {
                function: getCollectionOnlyHasValueAndNextLink,
            },
        },
        ParametersInPointGet: {
            description: "Point Get's MUST not have query parameters other than api version.",
            severity: "error",
            message: "{{error}}",
            resolved: true,
            formats: [oas2],
            given: "$[paths,'x-ms-paths']",
            then: {
                function: ParametersInPointGet,
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
                    shouldNot: ["id", "name", "type", "location"],
                },
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
        PatchResponseCode: {
            description: "Synchronous PATCH must have 200 return code and LRO PATCH must have 200 and 202 return codes.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[patch]"],
            then: {
                function: PatchResponseCode,
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
        PathForPutOperation: {
            description: "The path for 'put' operation must be under a subscription and resource group.",
            message: "{{description}}",
            severity: "error",
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
        RepeatedPathInfo: {
            description: "Information in the Path should not be repeated in the request body (i.e. subscription ID, resource group name, resource name).",
            message: "The '{{error}}' already appears in the path, please don't repeat it in the request body.",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*.put^",
            then: {
                function: bodyParamRepeatedInfo,
            },
        },
        RequestSchemaForTrackedResourcesMustHaveTags: {
            description: "A tracked resource MUST always have tags as a top level optional property",
            message: "{{description}}. {{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*.put^",
            then: {
                function: trackedResourceTagsPropertyInRequest,
            },
        },
        PutResponseSchemaDescription: {
            description: `For any PUT, response code should be 201 if resource was newly created and 200 if updated.`,
            message: "{{error}}",
            severity: "error",
            resolved: false,
            given: ["$[paths,'x-ms-paths'].*.put.responses"],
            then: {
                function: PutResponseSchemaDescription,
            },
        },
        PutGetPatchResponseSchema: {
            description: `For a given path with PUT, GET and PATCH operations, the schema of the response must be the same.`,
            message: "{{property}} has different responses for PUT/GET/PATCH operations. The PUT/GET/PATCH operations must have same schema response.",
            severity: "error",
            resolved: false,
            given: ["$[paths,'x-ms-paths'].*.put^"],
            then: {
                function: putGetPatchScehma,
            },
        },
        XmsResourceInPutResponse: {
            description: `The 200 response model for an ARM PUT operation must have x-ms-azure-resource extension set to true in its hierarchy.`,
            message: "{{error}}",
            severity: "error",
            resolved: true,
            given: ["$[paths,'x-ms-paths'].*.put"],
            then: {
                function: withXmsResource,
            },
        },
        LocationMustHaveXmsMutability: {
            description: "A tracked resource's location property must have the x-ms-mutability properties set as read, create.",
            message: 'Property `location` must have `"x-ms-mutability":["read", "create"]` extension defined.',
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$.definitions[*].properties.location"],
            then: {
                function: locationMustHaveXmsMutability,
            },
        },
        ResponseSchemaSpecifiedForSuccessStatusCode: {
            description: "The 200 and 201 success status codes for an ARM PUT operation must have a response schema specified.",
            message: "{{error}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.put"],
            then: {
                function: responseSchemaSpecifiedForSuccessStatusCode,
            },
        },
        PutRequestResponseSchemeArm: {
            description: "The request & response('200') schema of the PUT operation must be same.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[put][responses][?(@property === '200' || @property === '201')]^^"],
            then: {
                function: putRequestResponseScheme,
            },
        },
        SyncPostReturn: {
            description: "A synchronous Post operation should return 200 with response schema or 204 without response schema.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*[post]",
            then: {
                function: SyncPostReturn,
            },
        },
        LroPostReturn: {
            description: "A long running Post operation should return 200 with response schema and 202 without response schema.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*[post].[?(@property === 'x-ms-long-running-operation' && @ === true)]^",
            then: {
                function: lroPostReturn,
            },
        },
        ParametersInPost: {
            description: "For a POST action parameters MUST be in the payload and not in the URI.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*[post][parameters]",
            then: {
                function: ParametersInPost,
            },
        },
        LROPostFinalStateViaProperty: {
            description: "A long running operation (LRO) post MUST have 'long-running-operation-options' specified and MUST have the 'final-state-via' property set to 'azure-async-operation'.",
            message: "{{error}}",
            severity: "off",
            resolved: false,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[post]"],
            then: {
                function: LROPostFinalStateViaProperty,
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
        ResourceNameRestriction: {
            description: "This rule ensures that the authors explicitly define these restrictions as a regex on the resource name.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'].*.^",
            then: {
                function: resourceNameRestriction,
            },
        },
        PathForNestedResource: {
            description: "Path for CRUD methods on a nested resource type MUST follow valid resource naming.",
            message: "{{error}}",
            severity: "error",
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
            severity: "error",
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
        NoDuplicatePathsForScopeParameter: {
            description: 'Paths with explicitly defined scope should not be present if there is an equivalent path with the "scope" parameter.',
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$.paths[?(@property.match(/.*{scope}.*/))]~))", "$.x-ms-paths[?(@property.match(/.*{scope}.*/))]~))"],
            then: {
                function: noDuplicatePathsForScopeParameter,
            },
        },
        ReservedResourceNamesModelAsEnum: {
            description: "Service-defined (reserved) resource names must be represented as an enum type with modelAsString set to true, not as a static string in the path.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths']"],
            then: {
                function: reservedResourceNamesModelAsEnum,
            },
        },
        OperationsApiSchemaUsesCommonTypes: {
            description: "Operations API path must follow the schema provided in the common types.",
            message: "{{description}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: "$[paths,'x-ms-paths'][?(@property.match(/\\/providers\\/\\w+\\.\\w+\\/operations$/i))].get.responses.200.schema.$ref",
            then: {
                function: pattern,
                functionOptions: {
                    match: ".*/common-types/resource-management/v\\d+/types.json#/definitions/OperationListResult",
                },
            },
        },
        OperationsApiTenantLevelOnly: {
            description: "The get operations endpoint must only be at the tenant level.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: "$.[paths,'x-ms-paths']",
            then: {
                function: operationsApiTenantLevelOnly,
            },
        },
        ResourceMustReferenceCommonTypes: {
            description: "Resource definitions must use the common types TrackedResource or ProxyResource definitions.",
            message: "{{error}}",
            severity: "off",
            resolved: false,
            formats: [oas2],
            given: ["$.paths.*.[get,put,patch].responses.200.schema.$ref"],
            then: {
                function: resourceMustReferenceCommonTypes,
            },
        },
        ProvisioningStateMustBeReadOnly: {
            description: "This is a rule introduced to validate if provisioningState property is set to readOnly or not.",
            message: "{{error}}",
            severity: "off",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*.responses.*.schema"],
            then: {
                function: provisioningStateMustBeReadOnly,
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
        NoErrorCodeResponses: {
            description: "Invalid status code specified. Please refer to the documentation for the allowed set.",
            message: "{{description}}",
            severity: "error",
            resolved: false,
            formats: [oas2],
            given: ["$.paths.*.*.responses.*~"],
            then: {
                function: noErrorCodeResponses,
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
        APIVersionPattern: {
            description: "The API Version parameter MUST be in the Year-Month-Date format (i.e. 2016-07-04.)  NOTE that this is the en-US ordering of month and date.",
            severity: "error",
            message: "{{description}}",
            resolved: true,
            formats: [oas2],
            given: "$.info.version",
            then: {
                function: pattern,
                functionOptions: {
                    match: "^(20\\d{2})-(0[1-9]|1[0-2])-((0[1-9])|[12][0-9]|3[01])(-(preview))?$",
                },
            },
        },
        ParameterNotDefinedInGlobalParameters: {
            description: "Per ARM guidelines, if `subscriptionId` is used anywhere as a path parameter, it must always be defined as global parameter. `api-version` is almost always an input parameter in any ARM spec and must also be defined as a global parameter.",
            message: "{{error}}",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'parameters')]"],
            then: {
                function: parameterNotDefinedInGlobalParameters,
            },
        },
        ParameterNotUsingCommonTypes: {
            description: "This rule checks for parameters defined in common-types that are not using the common-types definition.",
            message: "{{error}}",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'parameters')]"],
            then: {
                function: parameterNotUsingCommonTypes,
            },
        },
        CollectionObjectPropertiesNaming: {
            description: "Per ARM guidelines, a model returned by an `x-ms-pageable` operation must have a property named `value`. This property indicates what type of array the object is.",
            severity: "error",
            message: "{{error}}",
            resolved: true,
            formats: [oas2],
            given: "$.paths.*[get,post]",
            then: {
                function: collectionObjectPropertiesNaming,
            },
        },
        DefinitionsPropertiesNamesCamelCase: {
            description: "Property names should be camel case.",
            message: "Property name should be camel case.",
            severity: "error",
            resolved: false,
            given: "$.definitions..[?(@property === 'type' && @ === 'object')]^.properties[?(@property.match(/^[^@].+$/))]~",
            then: {
                function: camelCase,
            },
        },
        GuidUsage: {
            description: `Verifies whether format is specified as "uuid" or not.`,
            message: "Usage of Guid is not recommended. If GUIDs are absolutely required in your service, please get sign off from the Azure API review board.",
            severity: "error",
            resolved: false,
            given: "$..[?(@property === 'format' && @ === 'uuid')]",
            then: {
                function: falsy,
            },
        },
        InvalidSkuModel: {
            description: `A Sku model must have 'name' property. It can also have 'tier', 'size', 'family', 'capacity' as optional properties.`,
            message: "{{error}}",
            severity: "warn",
            resolved: true,
            given: "$.definitions[?(@property.match(/^sku$/i))]",
            then: {
                function: skuValidation,
            },
        },
        NonApplicationJsonType: {
            description: `Verifies whether operation supports "application/json" as consumes or produces section.`,
            message: "Only content-type 'application/json' is supported by ARM",
            severity: "warn",
            resolved: true,
            given: ["$[produces,consumes].*", "$[paths,'x-ms-paths'].*.*[produces,consumes].*"],
            then: {
                function: pattern,
                functionOptions: {
                    match: "application/json",
                },
            },
        },
        SecurityDefinitionsStructure: {
            description: `Each OpenAPI json document must contain a security definitions section and the section must adhere to a certain format.`,
            message: "{{error}}",
            severity: "error",
            resolved: true,
            given: ["$"],
            then: {
                function: securityDefinitionsStructure,
            },
        },
        SubscriptionIdParameterInOperations: {
            description: `'subscriptionId' must not be an operation parameter and must be declared in the global parameters section.`,
            message: "Parameter 'subscriptionId' is not allowed in the operations section, define it in the global parameters section instead/Parameter '{{path}}' is referenced but not defined in the global parameters section of Service Definition",
            severity: "error",
            resolved: false,
            given: [
                "$[paths,'x-ms-paths'].*.*.parameters.*[?(@property === 'name' && @.match(/^subscriptionid$/i))]^",
                "$[paths,'x-ms-paths'].*.parameters.*[?(@property === 'name' && @.match(/^subscriptionid$/i))]^",
            ],
            then: {
                function: falsy,
            },
        },
        OperationsApiResponseSchema: {
            severity: "error",
            message: "The response schema of operations API '{{error}}' does not match the ARM specification. Please standardize the schema.",
            resolved: true,
            given: "$.paths[?(@property.match(/\\/providers\\/\\w+\\.\\w+\\/operations$/i))].get.responses.200.schema",
            then: {
                function: operationsApiSchema,
            },
        },
        HttpsSupportedScheme: {
            description: "Verifies whether specification supports HTTPS scheme or not.",
            message: "Azure Resource Management only supports HTTPS scheme.",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$.schemes"],
            then: {
                function: httpsSupportedScheme,
            },
        },
        MissingDefaultResponse: {
            description: "All operations should have a default (error) response.",
            message: "Operation is missing a default response.",
            severity: "error",
            given: "$.paths.*.*.responses",
            then: {
                field: "default",
                function: truthy,
            },
        },
    },
};

export { ruleset as default };
