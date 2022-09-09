// Checks for the presence and existence of the security definition

export const securityDefinitionsStructure = (swagger: any, _opts: any) => {
  if (swagger === "" || typeof swagger !== "object") {
    return [];
  }
  if (!Object.keys(swagger).includes("securityDefinitions")) {
    return [];
  }
  const errors: any = [];
  const securityDefinition = swagger.securityDefinitions;
  let likeModule = false;
  if (
    Object.getOwnPropertyNames(securityDefinition).length === 1 &&
    Object.getOwnPropertyNames(securityDefinition)[0] === "azure_auth" &&
    Object.getOwnPropertyNames(securityDefinition.azure_auth).length === 5 &&
    securityDefinition.azure_auth.type === "oauth2" &&
    securityDefinition.azure_auth.authorizationUrl ===
    "https://login.microsoftonline.com/common/oauth2/authorize" &&
    securityDefinition.azure_auth.flow === "implicit" &&
    securityDefinition.azure_auth.description &&
    securityDefinition.azure_auth.description !== "" &&
    Object.getOwnPropertyNames(securityDefinition.azure_auth.scopes).length === 1 &&
    Object.getOwnPropertyNames(securityDefinition.azure_auth.scopes)[0] === "user_impersonation" &&
    securityDefinition.azure_auth.scopes.user_impersonation &&
    securityDefinition.azure_auth.scopes.user_impersonation !== ""
  ) {
    likeModule = true;
  }
  if (!likeModule) {
    errors.push({
      message: `Every OpenAPI(swagger) spec/configuration must have a security definitions section and it must adhere to the following structure: https://github.com/Azure/azure-openapi-validator/blob/main/docs/security-definitions-structure-validation.md`,
    });
  }
  return errors;
};
