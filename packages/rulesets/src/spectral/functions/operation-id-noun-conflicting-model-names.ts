// Check if the noun part of an operationId (Noun_Verb) conflicts with any model names provided in the spec.

export const operationIdNounConflictingModelNames = (operationId: any, _opts: any, ctx: any) => {
    if (operationId === "" || typeof operationId !== 'string') {
        return [];
    }
    if (!operationId.includes("_")) {
        return [];
    }
    const path = ctx.path || [];
    const errors: any = [];
    const nounPartOfOperationId = operationId.split("_")[0];
    const swagger = ctx.document.parserResult.data
    const definitionsList = swagger.definitions ? Object.keys(swagger.definitions) : [];
    if (definitionsList.includes(nounPartOfOperationId)) {
        errors.push({
            message: `OperationId has a noun that conflicts with one of the model names in definitions section. The model name will be disambiguated to '${nounPartOfOperationId}Model'. Consider using the plural form of '${nounPartOfOperationId}' to avoid this. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change`,
            path: [...path],
        });
    }
    return errors;
};
