// Checks for the presence and existence of the security definition

import { isSchemaEqual } from "./utils";

export const securityDefinitionsStructure = (swagger: any, _opts: any) => {
  if (swagger === "" || typeof swagger !== "object") {
    return [];
  }
  if (!Object.keys(swagger).includes("securityDefinitions")) {
    return [];
  }
  const errors: any = [];
  const securityDefinitionsModule = {
    azure_auth: {
      type: "oauth2",
      authorizationUrl: "https://login.microsoftonline.com/common/oauth2/authorize",
      flow: "implicit",
      description: "Azure Active Directory OAuth2 Flow",
      scopes: {
        user_impersonation: "impersonate your user account",
      },
    },
  };
  const securityDefinition = swagger.securityDefinitions;
  const securityDefinitionClone = JSON.parse(JSON.stringify(securityDefinition));
  if (
    securityDefinitionClone.azure_auth?.description &&
    securityDefinitionClone.azure_auth.description !== ""
  ) {
    securityDefinitionClone.azure_auth.description = "Azure Active Directory OAuth2 Flow";
  }
  if (
    securityDefinitionClone.azure_auth?.scopes.user_impersonation &&
    securityDefinitionClone.azure_auth.scopes.user_impersonation !== ""
  ) {
    securityDefinitionClone.azure_auth.scopes.user_impersonation = "impersonate your user account";
  }
  if (!isSchemaEqual(securityDefinitionClone, securityDefinitionsModule)) {
    errors.push({
      message: `Every OpenAPI(swagger) spec/configuration must have a security definitions section and it must adhere to the following structure: https://github.com/Azure/azure-openapi-validator/blob/main/docs/security-definitions-structure-validation.md`,
    });
  }
  return errors;
};
