import { oas2, oas3 } from '@stoplight/spectral-formats';
import { pattern, falsy, truthy } from '@stoplight/spectral-functions';
import 'lodash';

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

const ruleset = {
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
            disableForTypeSpec: true,
            disableForTypeSpecReason: "TODO",
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
            disableForTypeSpec: true,
            disableForTypeSpecReason: "Covered by TSP's 'documentation-required' rule.",
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
            disableForTypeSpec: true,
            disableForTypeSpecReason: "Covered by TSP's 'documentation-required' rule.",
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
            description: "Operations with a 202 response must specify `x-ms-long-running-operation: true`. GET operation is excluded from the validation as GET will have 202 only if it is a polling action & hence x-ms-long-running-operation wouldn't be defined",
            message: "Operations with a 202 response must specify `x-ms-long-running-operation: true`.  GET operation is excluded from the validation as GET will have 202 only if it is a polling action & hence x-ms-long-running-operation wouldn't be defined",
            severity: "error",
            formats: [oas2],
            given: "$.paths[*][put,patch,post,delete].responses[?(@property == '202')]^^",
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
            disableForTypeSpec: true,
            disableForTypeSpecReason: "TODO",
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

export { ruleset as default };
