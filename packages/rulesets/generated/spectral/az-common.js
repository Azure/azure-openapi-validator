import { oas2 } from '@stoplight/spectral-formats';
import { pattern, falsy, truthy } from '@stoplight/spectral-functions';

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
            path: [...path],
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

const nextLinkPropertyMustExist = (opt, _opts, ctx) => {
    var _a, _b, _c, _d;
    if (opt === null || typeof opt !== "object") {
        return [];
    }
    if (opt["x-ms-pageable"] === undefined) {
        return [];
    }
    const path = ctx.path || [];
    const errors = [];
    const nextLinkName = ((_a = opt["x-ms-pageable"]) === null || _a === void 0 ? void 0 : _a.nextLinkName) || null;
    const responseSchemaProperties = ((_d = (_c = (_b = opt === null || opt === void 0 ? void 0 : opt.responses) === null || _b === void 0 ? void 0 : _b["200"]) === null || _c === void 0 ? void 0 : _c.schema) === null || _d === void 0 ? void 0 : _d.properties) || {};
    if (nextLinkName !== null && nextLinkName !== "") {
        if (Object.getOwnPropertyNames(responseSchemaProperties).length === 0 ||
            !Object.getOwnPropertyNames(responseSchemaProperties).includes(nextLinkName)) {
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
        if (!Object.getOwnPropertyNames(swagger.paths).includes(pathName)) {
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

const ruleset = {
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
            severity: "error",
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
            severity: "error",
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
            severity: "error",
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
            severity: "error",
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
            severity: "error",
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
            severity: "error",
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
            severity: "error",
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
        LongRunningOperationsOptionsValidator: {
            description: "A LRO Post operation with return schema must have \"x-ms-long-running-operation-options\" extension enabled.",
            message: "{{error}}",
            severity: "error",
            resolved: true,
            formats: [oas2],
            given: ["$[paths,'x-ms-paths'].*[post][?(@property === 'x-ms-long-running-operation' && @ === true)]^"],
            then: {
                function: longRunningOperationsOptionsValidator,
            },
        },
        MutabilityWithReadOnly: {
            description: "Verifies whether a model property which has a readOnly property set has the appropriate `x-ms-mutability` options. If `readonly: true`, `x-ms-mutability` must be `[\"read\"]`. If `readonly: false`, `x-ms-mutability` can be any of the `x-ms-mutability` options.",
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
    },
};

export { ruleset as default };
