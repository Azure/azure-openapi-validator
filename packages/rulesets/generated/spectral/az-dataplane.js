import { oas2, oas3 } from '@stoplight/spectral-formats';
import { pattern, falsy, truthy, undefined as undefined$1, casing } from '@stoplight/spectral-functions';

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
            return [{
                    message: 'Since operation \'${swaggerObj.operationId}\' response has model definition \'x-ms-pageable\', it should be of the form \\"*_list*\\". Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change.',
                    path: [...path, path[path.length - 1], 'operationId'],
                }];
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
            if (((_b = (_a = response.schema.properties) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.type) === "array") {
                if (!listRegex.test(swaggerObj['operationId'])) {
                    gotArray = true;
                    return true;
                }
            }
        }
        return false;
    });
    if (gotArray)
        return [{
                message: 'Since operation `${swaggerObj.operationId}` response has model definition \'array\', it should be of the form "_\\_list_".',
                path: [...path, path[path.length - 1], 'operationId'],
            }];
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
            if (parameter.name &&
                parameter.name === "subscriptionId" &&
                !globalParametersList.includes("subscriptionId")) {
                pushToError(errors, "subscriptionId", path);
            }
        }
        if (!globalParametersList.includes("api-version")) {
            pushToError(errors, "api-version", path);
        }
    }
    else {
        pushToError(errors, "api-version", path);
    }
    return errors;
};

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
        "byte",
        "binary",
        "date",
        "date-time",
        "password",
        "char",
        "time",
        "date-time-rfc1123",
        "duration",
        "uuid",
        "base64url",
        "url",
        "odata-query",
        "certificate",
        "uri",
        "uri_reference",
        "uri_template",
        "email",
        "hostname",
        "ipv4",
        "ipv6",
        "regex",
        "json_pointer",
        "relative_json_pointer",
        "arm_id",
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
    if (swaggerObj['x-ms-examples'] !== undefined)
        return [];
    const path = paths.path || [];
    return [
        {
            message: `Please provide x-ms-examples describing minimum/maximum property set for response/request payloads for operations.`,
            path: path
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
        LroStatusCodesReturnTypeSchema: {
            description: "The '200'/'201' responses of the long running operation must have a schema definition.",
            message: "{{error}}",
            severity: "warn",
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
        PutRequestResponseScheme: {
            description: "The request & response('200') schema of the PUT operation must be same.",
            message: "{{error}}",
            severity: "warn",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[put][responses][?(@property === '200' || @property === '201')]^^"],
            then: {
                function: putRequestResponseScheme,
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
            description: 'A LRO Post operation with return schema must have "x-ms-long-running-operation-options" extension enabled.',
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
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$..[?(@object() && @.description)].description"],
            then: {
                function: descriptiveDescriptionRequired,
            },
        },
        AvoidNestedProperties: {
            description: "Nested properties can result into bad user experience especially when creating request objects. `x-ms-client-flatten` flattens the model properties so that the users can analyze and set the properties much more easily.",
            message: "Consider using x-ms-client-flatten to provide a better end user experience",
            severity: "warn",
            resolved: false,
            formats: [oas2],
            given: ["$..[?(@object() && @.properties)][?(@object() && @.properties)].properties"],
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
    const path = paths.path || [];
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
        for (const responseCode of responseCodes) {
            if ((responseCodes.length === 1 && !validResponseCodes.includes(responseCode)) ||
                (responseCode !== "default" && !validResponseCodes.includes(responseCode))) {
                errors.push({
                    message: `A '${method}' operation '${operationId}' with x-ms-long-running-operation extension must have a valid terminal success status code ${validResponseCodeString}.`,
                    path: [...path, method],
                });
            }
        }
    }
    return errors;
};
const longRunningResponseStatusCodeDataPlane = (methodOp, _opts, ctx) => {
    const validResponseCodesList = {
        delete: ["200", "204", "202"],
        post: ["200", "201", "202", "204"],
        put: ["200", "201", "202"],
        patch: ["200", "201", "202"],
    };
    return longRunningResponseStatusCode(methodOp, _opts, ctx, validResponseCodesList);
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

const hostParameters = (parameterizedHost, _opts, paths) => {
    var _a;
    if (parameterizedHost === null || typeof parameterizedHost !== "object") {
        return [];
    }
    const path = paths.path || [];
    const errors = [];
    const useSchemePrefix = (_a = parameterizedHost.useSchemePrefix) !== null && _a !== void 0 ? _a : true;
    const parameters = parameterizedHost.parameters;
    if (!useSchemePrefix && parameters && Array.isArray(parameters)) {
        parameters.forEach((p, index) => {
            const location = p["x-ms-parameter-location"];
            if (p.in === "path" && p["x-ms-skip-url-encoding"] === true && location === "client") {
                if (p.name !== "endpoint") {
                    errors.push({
                        message: "The host parameter must be called 'endpoint'.",
                        path: [...path, "parameters", index],
                    });
                }
                if (p.type !== "string" || p.format !== "url") {
                    errors.push({
                        message: "The host parameter must be typed \"type 'string', format 'url'\".",
                        path: [...path, "parameters", index],
                    });
                }
            }
        });
    }
    return errors;
};

const operationId = (operation, _opts, paths) => {
    var _a, _b;
    if (operation === null || typeof operation !== 'object') {
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
    return errors;
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

function checkSchemaTypeAndFormat(schema, options, { path }) {
    if (schema === null || typeof schema !== "object") {
        return [];
    }
    const errors = [];
    const stringFormats = [
        "byte",
        "binary",
        "date",
        "date-time",
        "password",
        "char",
        "time",
        "date-time-rfc1123",
        "duration",
        "uuid",
        "base64url",
        "url",
        "odata-query",
        "certificate",
    ];
    if (schema.type === "string") {
        if (schema.format) {
            if (!stringFormats.includes(schema.format)) {
                errors.push({
                    message: `Schema with type: string has unrecognized format: ${schema.format}`,
                    path: [...path, "format"],
                });
            }
        }
    }
    else if (schema.type === "integer") {
        if (schema.format) {
            if (!["int32", "int64", "unixtime"].includes(schema.format)) {
                errors.push({
                    message: `Schema with type: integer has unrecognized format: ${schema.format}`,
                    path: [...path, "format"],
                });
            }
        }
        else {
            errors.push({
                message: "Schema with type: integer should specify format",
                path,
            });
        }
    }
    else if (schema.type === "number") {
        if (schema.format) {
            if (!["float", "double", "decimal"].includes(schema.format)) {
                errors.push({
                    message: `Schema with type: number has unrecognized format: ${schema.format}`,
                    path: [...path, "format"],
                });
            }
        }
        else {
            errors.push({
                message: "Schema with type: number should specify format",
                path,
            });
        }
    }
    else if (schema.type === "boolean") {
        if (schema.format) {
            errors.push({
                message: "Schema with type: boolean should not specify format",
                path: [...path, "format"],
            });
        }
    }
    else if (schema.properties && typeof schema.properties === "object") {
        for (const [key, value] of Object.entries(schema.properties)) {
            errors.push(...checkSchemaTypeAndFormat(value, options, { path: [...path, "properties", key] }));
        }
    }
    if (schema.allOf && Array.isArray(schema.allOf)) {
        for (const [index, value] of schema.allOf.entries()) {
            errors.push(...checkSchemaTypeAndFormat(value, options, { path: [...path, "allOf", index] }));
        }
    }
    return errors;
}

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
        AdditionalPropertiesAndProperties: {
            description: "Don't specify additionalProperties as a sibling of properties.",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$..[?(@object() && @.type === 'object' && @.properties)]",
            then: {
                field: "additionalProperties",
                function: falsy,
            },
        },
        AdditionalPropertiesObject: {
            description: "additionalProperties with type object is a common error.",
            severity: "warn",
            formats: [oas2, oas3],
            resolved: false,
            given: "$..[?(@property == 'additionalProperties' && @.type == 'object' && @.properties == undefined)]",
            then: {
                function: falsy,
            },
        },
        ApiVersionEnum: {
            description: "The api-version parameter should not be an enum.",
            severity: "warn",
            formats: [oas2, oas3],
            given: [
                "$.paths[*].parameters[?(@.name == 'ApiVersion')]",
                "$.paths.*[get,put,post,patch,delete,options,head].parameters[?(@.name == 'api-version')]",
            ],
            then: {
                field: "enum",
                function: falsy,
            },
        },
        ConsistentResponseBody: {
            description: "Ensure the get, put, and patch response body schemas are consistent.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2],
            given: "$.paths.*",
            then: {
                function: consistentresponsebody,
            },
        },
        DefaultResponse: {
            description: "All operations should have a default (error) response.",
            message: "Operation is missing a default response.",
            severity: "warn",
            given: "$.paths.*.*.responses",
            then: {
                field: "default",
                function: truthy,
            },
        },
        Delete204Response: {
            description: "A delete operation should have a 204 response.",
            message: "A delete operation should have a `204` response.",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$.paths[*].delete.responses",
            then: {
                function: delete204Response,
            },
        },
        ErrorResponse: {
            description: "Error response body should conform to Microsoft Azure API Guidelines.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2],
            given: "$.paths[*][*].responses",
            then: {
                function: errorResponse,
            },
        },
        Formdata: {
            description: "Check for appropriate use of formData parameters.",
            severity: "warn",
            formats: [oas2],
            given: '$.paths.*[get,put,post,patch,delete,options,head].parameters[?(@.in == "formData")]',
            then: {
                function: falsy,
            },
        },
        HeaderDisallowed: {
            description: "Authorization, Content-type, and Accept headers should not be defined explicitly.",
            message: 'Header parameter "{{value}}" should not be defined explicitly.',
            severity: "warn",
            formats: [oas2, oas3],
            given: [
                "$.paths[*].parameters[?(@.in == 'header')]",
                "$.paths.*[get,put,post,patch,delete,options,head].parameters[?(@.in == 'header')]",
            ],
            then: {
                function: pattern,
                field: "name",
                functionOptions: {
                    notMatch: "/^(authorization|content-type|accept)$/i",
                },
            },
        },
        LroExtension: {
            description: "Operations with a 202 response should specify `x-ms-long-running-operation: true`.",
            message: "Operations with a 202 response should specify `x-ms-long-running-operation: true`.",
            severity: "warn",
            formats: [oas2],
            given: "$.paths[*][*].responses[?(@property == '202')]^^",
            then: {
                field: "x-ms-long-running-operation",
                function: truthy,
            },
        },
        LroHeaders: {
            description: "A 202 response should include an Operation-Location response header.",
            message: "A 202 response should include an Operation-Location response header.",
            severity: "warn",
            formats: [oas2],
            given: "$.paths[*][*].responses[?(@property == '202')]",
            then: {
                function: hasHeader,
                functionOptions: {
                    name: "Operation-location",
                },
            },
        },
        MsPaths: {
            description: "Don't use x-ms-paths except where necessary to support legacy APIs.",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$.x-ms-paths",
            then: {
                function: falsy,
            },
        },
        Nullable: {
            description: "Avoid the use of x-nullable.",
            severity: "warn",
            formats: [oas2, oas3],
            resolved: false,
            given: "$..x-nullable",
            then: {
                function: undefined$1,
            },
        },
        OperationId: {
            description: "OperationId should conform to Azure API Guidelines",
            message: "{{error}}",
            severity: "warn",
            given: ["$.paths.*[get,put,post,patch,delete,options,head]"],
            then: {
                function: operationId,
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
        PaginationResponse: {
            description: "An operation that returns a list that is potentially large should support pagination.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2],
            given: ["$.paths.*[get,post]"],
            then: {
                function: paginationResponse,
            },
        },
        ParameterDefaultNotAllowed: {
            description: "A required parameter should not specify a default value.",
            severity: "warn",
            given: ["$.paths[*].parameters[?(@.required)]", "$.paths.*[get,put,post,patch,delete,options,head].parameters[?(@.required)]"],
            then: {
                field: "default",
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
        ParameterNamesConvention: {
            description: "Parameter names should conform to Azure naming conventions.",
            message: "{{error}}",
            severity: "warn",
            given: ["$.paths[*].parameters.*", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*"],
            then: {
                function: paramNames,
            },
        },
        ParameterNamesUnique: {
            description: "All parameter names for an operation should be case-insensitive unique.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$.paths[*]",
            then: {
                function: paramNamesUnique,
            },
        },
        ParameterOrder: {
            description: "Path parameters must be in the same order as in the path.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$.paths",
            then: {
                function: paramOrder,
            },
        },
        PathParameterNames: {
            description: "Path parameter names should be consistent across all paths.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$.paths",
            resolved: false,
            then: {
                function: pathParamNames,
            },
        },
        PatchContentType: {
            description: "The request body content type for patch operations should be JSON merge patch.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2],
            given: "$",
            then: {
                function: patchContentYype,
            },
        },
        PathCharacters: {
            description: "Path should contain only recommended characters.",
            message: "Path contains non-recommended characters.",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$.paths.*~",
            then: {
                function: pattern,
                functionOptions: {
                    match: "^(/([0-9A-Za-z._~-]+|{[^}]+}))*(/([0-9A-Za-z._~:-]+|{[^}]*}(:[0-9A-Za-z._~-]+)?))$",
                },
            },
        },
        PathParameterSchema: {
            description: "Path parameter should be type: string and specify maxLength and pattern.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2, oas3],
            given: [
                "$.paths[*].parameters[?(@.in == 'path')]",
                "$.paths.*[get,put,post,patch,delete,options,head].parameters[?(@.in == 'path')]",
            ],
            then: {
                function: pathParamSchema,
            },
        },
        Post201Response: {
            description: "Using post for a create operation is discouraged.",
            message: "Using post for a create operation is discouraged.",
            severity: "warn",
            formats: [oas2],
            given: "$.paths[*].post.responses",
            then: {
                field: "201",
                function: falsy,
            },
        },
        PropertyDescription: {
            description: "All schema properties should have a description.",
            message: "Property should have a description.",
            severity: "warn",
            resolved: false,
            given: "$..properties[?(@object() && @.$ref == undefined)]",
            then: {
                field: "description",
                function: truthy,
            },
        },
        PropertyType: {
            description: "All schema properties should have a defined type.",
            message: "Property should have a defined type.",
            severity: "warn",
            resolved: false,
            given: "$..properties[?(@object() && @.$ref == undefined)]",
            then: {
                field: "type",
                function: truthy,
            },
        },
        PutPath: {
            description: "The path for a put should have a final path parameter.",
            message: "The path for a put should have a final path parameter.",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$.paths[*].put^~",
            then: {
                function: pattern,
                functionOptions: {
                    match: "/\\}$/",
                },
            },
        },
        RequestBodyNotAllowed: {
            description: "A get or delete operation must not accept a body parameter.",
            severity: "warn",
            formats: [oas2],
            given: ["$.paths[*][get,delete].parameters[*]"],
            then: {
                field: "in",
                function: pattern,
                functionOptions: {
                    notMatch: "/^body$/",
                },
            },
        },
        RequestBodyOptional: {
            description: "Flag optional request body -- common oversight.",
            message: "The body parameter is not marked as required.",
            severity: "warn",
            formats: [oas2],
            given: ["$.paths[*][put,post,patch].parameters[?(@.in == 'body')]"],
            then: {
                field: "required",
                function: truthy,
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
        SchemaNamesConvention: {
            description: "Schema names should be Pascal case.",
            message: "Schema name should be Pascal case.",
            severity: "warn",
            formats: [oas2],
            given: "$.definitions.*~",
            then: {
                function: casing,
                functionOptions: {
                    type: "pascal",
                },
            },
        },
        SchemaTypeAndFormat: {
            description: "Schema should use well-defined type and format.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2],
            given: [
                "$.paths[*][put,post,patch].parameters[?(@.in == 'body')].schema",
                "$.paths[*][get,put,post,patch,delete].responses[*].schema",
            ],
            then: {
                function: checkSchemaTypeAndFormat,
            },
        },
        SecurityDefinitionDescription: {
            description: "A security definition should have a description.",
            message: "Security definition should have a description.",
            severity: "warn",
            formats: [oas2, oas3],
            given: ["$.securityDefinitions[*]", "$.components.securitySchemes[*]"],
            then: {
                field: "description",
                function: truthy,
            },
        },
        SuccessResponseBody: {
            description: "All success responses except 202 & 204 should define a response body.",
            severity: "warn",
            formats: [oas2],
            given: "$.paths[*][*].responses[?(@property >= 200 && @property < 300 && @property != '202' && @property != '204')]",
            then: {
                field: "schema",
                function: truthy,
            },
        },
        VersionConvention: {
            description: "API version should be a date in YYYY-MM-DD format, optionally suffixed with '-preview'.",
            severity: "warn",
            formats: [oas2, oas3],
            given: "$.info.version",
            then: {
                function: pattern,
                functionOptions: {
                    match: "^\\d\\d\\d\\d-\\d\\d-\\d\\d(-preview)?$",
                },
            },
        },
        VersionPolicy: {
            description: "Specify API version using `api-version` query parameter, not in path.",
            message: "{{error}}",
            severity: "warn",
            formats: [oas2],
            given: "$",
            then: {
                function: versionPolicy,
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
            given: ["$.paths[*].parameters.*", "$.paths.*[get,put,post,patch,delete,options,head].parameters.*"],
            then: {
                function: avoidAnonymousParameter,
            },
        },
        HostParametersValidation: {
            description: "Validate the parameters in x-ms-parameterized-host.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$.x-ms-parameterized-host"],
            then: {
                function: hostParameters,
            },
        },
        LongRunningResponseStatusCodeDataPlane: {
            description: 'A LRO Post operation with return schema must have "x-ms-long-running-operation-options" extension enabled.',
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*.*[?(@property === 'x-ms-long-running-operation' && @ === true)]^^"],
            then: {
                function: longRunningResponseStatusCodeDataPlane,
            },
        },
    },
};

export { ruleset as default };
