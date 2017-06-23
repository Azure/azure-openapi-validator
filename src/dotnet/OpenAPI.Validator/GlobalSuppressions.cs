// This file is used by Code Analysis to maintain SuppressMessage 
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given 
// a specific target and scoped to a namespace, type, member, etc.
//
// To add a suppression to this file, right-click the message in the 
// Code Analysis results, point to "Suppress Message", and click 
// "In Suppression File".
// You do not need to add suppressions to this file manually.

[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures",
    Scope = "member", Target = "OpenAPI.Validator.Model.Operation.#Security",
    Justification = "This type is strictly a serialization model.")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Paths",
    Justification = "This type is strictly a serialization model.")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Security",
    Justification = "This type is strictly a serialization model.")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1054:UriParametersShouldNotBeStrings",
    MessageId = "1#", Scope = "member",
    Target = "OpenAPI.Validator.OperationBuilder.#BuildMethod(AutoRest.Core.Model.HttpMethod,System.String,System.String,System.String)", Justification = "May not parse as valid Uri")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1054:UriParametersShouldNotBeStrings",
    MessageId = "1#", Scope = "member",
    Target = "OpenAPI.Validator.SwaggerModeler.#BuildMethod(AutoRest.Core.Model.HttpMethod,System.String,System.String,OpenAPI.Validator.Model.Operation)", Justification = "May not parse as valid Uri")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1055:UriReturnValuesShouldNotBeStrings",
    Scope = "member", Target = "OpenAPI.Validator.SwaggerModeler.#BuildMethodBaseUrl(AutoRest.Core.Model.CodeModel,System.String)", Justification = "May not parse as valid Uri")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings",
    Scope = "member", Target = "OpenAPI.Validator.Model.Contact.#Url", Justification = "May not parse as valid Uri")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings",
    Scope = "member", Target = "OpenAPI.Validator.Model.ExternalDoc.#Url", Justification = "May not parse as valid Uri")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings",
    Scope = "member", Target = "OpenAPI.Validator.Model.License.#Url", Justification = "May not parse as valid Uri")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings",
    Scope = "member", Target = "OpenAPI.Validator.Model.SecurityDefinition.#AuthorizationUrl", Justification = "May not parse as valid Uri")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings",
    Scope = "member", Target = "OpenAPI.Validator.Model.SecurityDefinition.#TokenUrl", Justification = "May not parse as valid Uri")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:Do not pass literals as localized parameters", MessageId = "AutoRest.Core.Logging.ErrorManager.CreateError(System.String,System.Object[])", Scope = "member", Target = "OpenAPI.Validator.SwaggerParser.#Parse(System.String)", Justification = "Generated Code")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase",
    Scope = "member", Target = "OpenAPI.Validator.Extensions.#ToHttpMethod(System.String)", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase",
    Scope = "member", Target = "OpenAPI.Validator.SchemaResolver.#Dereference(System.String)", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1308:NormalizeStringsToUppercase",
    Scope = "member", Target = "OpenAPI.Validator.SwaggerModeler.#InitializeClientModel()", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling",
    Scope = "member", Target = "OpenAPI.Validator.OperationBuilder.#BuildMethod(AutoRest.Core.Model.HttpMethod,System.String,System.String,System.String)", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly",
    MessageId = "param", Scope = "member",
    Target = "OpenAPI.Validator.CollectionFormatBuilder.#OnBuildMethodParameter(AutoRest.Core.Model.Method,OpenAPI.Validator.Model.SwaggerParameter,System.Text.StringBuilder)", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly",
    MessageId = "Param", Scope = "member",
    Target = "OpenAPI.Validator.CollectionFormatBuilder.#OnBuildMethodParameter(AutoRest.Core.Model.Method,OpenAPI.Validator.Model.SwaggerParameter,System.Text.StringBuilder)", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly",
    MessageId = "OAuth", Scope = "type", Target = "OpenAPI.Validator.Model.OAuthFlow", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly",
    MessageId = "OAuth", Scope = "member", Target = "OpenAPI.Validator.Model.SecuritySchemeType.#OAuth2", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly",
    MessageId = "Ws", Scope = "member", Target = "OpenAPI.Validator.Model.TransferProtocolScheme.#Ws", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly",
    MessageId = "Wss", Scope = "member", Target = "OpenAPI.Validator.Model.TransferProtocolScheme.#Wss", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly",
    MessageId = "Ws", Scope = "member", Target = "OpenAPI.Validator.Model.TransferProtocolScheme.#Ws", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1716:IdentifiersShouldNotMatchKeywords",
    MessageId = "Default", Scope = "member", Target = "OpenAPI.Validator.Model.SwaggerObject.#Default", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1716:IdentifiersShouldNotMatchKeywords",
    MessageId = "Enum", Scope = "member", Target = "OpenAPI.Validator.Model.SwaggerObject.#Enum", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1721:PropertyNamesShouldNotMatchGetMethods",
    Scope = "member", Target = "OpenAPI.Validator.Model.SwaggerObject.#Type", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1724:TypeNamesShouldNotMatchNamespaces",
    Scope = "type", Target = "OpenAPI.Validator.Model.Schema", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1800:DoNotCastUnnecessarily",
    Scope = "member", Target = "OpenAPI.Validator.Model.SwaggerObject.#GetBuilder(OpenAPI.Validator.SwaggerModeler)")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA1801:ReviewUnusedParameters",
    MessageId = "operation", Scope = "member",
    Target = "OpenAPI.Validator.OperationBuilder.#SwaggerOperationProducesJson(OpenAPI.Validator.Model.Operation)")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA1801:ReviewUnusedParameters",
    MessageId = "operation", Scope = "member",
    Target = "OpenAPI.Validator.OperationBuilder.#SwaggerOperationConsumesJson(OpenAPI.Validator.Model.Operation)")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA1801:ReviewUnusedParameters",
    MessageId = "operation", Scope = "member",
    Target = "OpenAPI.Validator.OperationBuilder.#SwaggerOperationProducesOctetStream(OpenAPI.Validator.Model.Operation)")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA1801:ReviewUnusedParameters",
    MessageId = "operation", Scope = "member",
    Target = "OpenAPI.Validator.OperationBuilder.#SwaggerOperationConsumesMultipartFormData(OpenAPI.Validator.Model.Operation)", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming",
    "CA1703:ResourceStringsShouldBeSpelledCorrectly", MessageId = "multi", Scope = "resource",
    Target = "OpenAPI.Validator.Properties.Resources.resources", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly",
    MessageId = "Auth", Scope = "type", Target = "OpenAPI.Validator.Model.OAuthFlow", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly",
    MessageId = "Auth", Scope = "member", Target = "OpenAPI.Validator.Model.SecuritySchemeType.#OAuth2")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.Operation.#Tags", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.Operation.#Consumes", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.Operation.#Produces", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.Operation.#Parameters", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.Operation.#Responses", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.Operation.#Schemes", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.Operation.#Security", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.OperationResponse.#Headers", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.OperationResponse.#Examples", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.Schema.#Properties", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.Schema.#Required", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.Schema.#AllOf", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.SecurityDefinition.#Scopes", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Schemes", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Consumes", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Produces", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Paths", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Definitions", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Parameters", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Responses", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#SecurityDefinitions", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Security", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#Tags", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#ExternalReferences", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.SwaggerBase.#Extensions", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.SwaggerObject.#Enum", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.JsonConverters.SwaggerJsonConverter.#Document", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly",
    Scope = "member", Target = "OpenAPI.Validator.Model.ServiceDefinition.#CustomPaths", Justification = "Serialization Type")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity", Scope = "member", Target = "OpenAPI.Validator.SchemaBuilder.#BuildServiceType(System.String)")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:Do not pass literals as localized parameters", MessageId = "AutoRest.Core.Logging.ErrorManager.CreateError(System.String,System.Object[])", Scope = "member", Target = "OpenAPI.Validator.SwaggerModeler.#Build()")]
