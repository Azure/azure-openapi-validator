﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace OpenAPI.Validator.Properties
{
    using System;
    using System.Reflection;


    /// <summary>
    ///    A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class Resources
    {

        private static global::System.Resources.ResourceManager resourceMan;

        private static global::System.Globalization.CultureInfo resourceCulture;

        internal Resources()
        {
        }

        /// <summary>
        ///    Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager
        {
            get
            {
                if (object.ReferenceEquals(resourceMan, null))
                {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("OpenAPI.Validator.Properties.Resources", typeof(Resources).GetTypeInfo().Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }

        /// <summary>
        ///    Overrides the current thread's CurrentUICulture property for all
        ///    resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture
        {
            get
            {
                return resourceCulture;
            }
            set
            {
                resourceCulture = value;
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Top level properties should be one of name, type, id, location, properties, tags, plan, sku, etag, managedBy, identity. Model definition &apos;{0}&apos; has extra properties [&apos;{1}&apos;]..
        /// </summary>
        public static string AllowedTopLevelProperties
        {
            get
            {
                return ResourceManager.GetString("AllowedTopLevelProperties", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Property named: &apos;{0}&apos;, must follow camelCase style. Example: &apos;{1}&apos;..
        /// </summary>
        public static string BodyPropertyNameCamelCase
        {
            get
            {
                return ResourceManager.GetString("BodyPropertyNameCamelCase", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Booleans are not descriptive and make them hard to use. Consider using string enums with allowed set of values defined. Property: {0}.
        /// </summary>
        public static string BooleanPropertyNotRecommended
        {
            get
            {
                return ResourceManager.GetString("BooleanPropertyNotRecommended", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Collection object &apos;{0}&apos; returned by list operation &apos;{1}&apos; with &apos;x-ms-pageable&apos; extension, has no property named &apos;value&apos;..
        /// </summary>
        public static string CollectionObjectPropertiesNamingMessage
        {
            get
            {
                return ResourceManager.GetString("CollectionObjectPropertiesNamingMessage", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Since operation &apos;{0}&apos; response has model definition &apos;{1}&apos;, it should be of the form &quot;*_list*&quot;. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change..
        /// </summary>
        public static string ListOperationsNamingWarningMessage
        {
            get
            {
                return ResourceManager.GetString("ListOperationsNamingWarningMessage", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to A &apos;{0}&apos; operation &apos;{1}&apos; with x-ms-long-running-operation extension must have a valid terminal success status code {2}..
        /// </summary>
        public static string LongRunningResponseNotValid
        {
            get
            {
                return ResourceManager.GetString("LongRunningResponseNotValid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to {0} lacks &apos;description&apos; property. Consider adding a &apos;description&apos; element. Accurate description is essential for maintaining reference documentation..
        /// </summary>
        public static string MissingDescription
        {
            get
            {
                return ResourceManager.GetString("MissingDescription", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to {0} lacks &apos;description&apos; and &apos;summary&apos; property. Consider adding a &apos;description&apos;/&apos;summary&apos; element. Accurate description/summary is essential for maintaining reference documentation..
        /// </summary>
        public static string MissingSummaryDescription
        {
            get
            {
                return ResourceManager.GetString("MissingSummaryDescription", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to {0} lacks &apos;description&apos; and &apos;title&apos; property. Consider adding a &apos;description&apos;/&apos;title&apos; element. Accurate description/title is essential for maintaining reference documentation..
        /// </summary>
        public static string MissingTitleDescription
        {
            get
            {
                return ResourceManager.GetString("MissingTitleDescription", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to For better generated code quality, remove all references to &quot;msdn.microsoft.com&quot;..
        /// </summary>
        public static string MsdnReferencesDiscouraged
        {
            get
            {
                return ResourceManager.GetString("MsdnReferencesDiscouraged", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to {0} (already used in {1}).
        /// </summary>
        public static string NamespaceConflictReasonMessage
        {
            get
            {
                return ResourceManager.GetString("NamespaceConflictReasonMessage", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Please make sure that media types other than &apos;application/json&apos; are supported by your service..
        /// </summary>
        public static string NonAppJsonTypeNotSupported
        {
            get
            {
                return ResourceManager.GetString("NonAppJsonTypeNotSupported", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Only 1 underscore is permitted in the operation id, following Noun_Verb conventions..
        /// </summary>
        public static string OnlyOneUnderscoreAllowedInOperationId
        {
            get
            {
                return ResourceManager.GetString("OnlyOneUnderscoreAllowedInOperationId", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to OperationId is required for all operations. Please add it for &apos;{0}&apos; operation of &apos;{1}&apos; path..
        /// </summary>
        public static string OperationIdMissing
        {
            get
            {
                return ResourceManager.GetString("OperationIdMissing", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to OperationId has a noun that conflicts with one of the model names in definitions section. The model name will be disambiguated to &apos;{0}Model&apos;. Consider using the plural form of &apos;{1}&apos; to avoid this. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change..
        /// </summary>
        public static string OperationIdNounConflictingModelNamesMessage
        {
            get
            {
                return ResourceManager.GetString("OperationIdNounConflictingModelNamesMessage", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Per the Noun_Verb convention for Operation Ids, the noun &apos;{0}&apos; should not appear after the underscore. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change..
        /// </summary>
        public static string OperationIdNounInVerb
        {
            get
            {
                return ResourceManager.GetString("OperationIdNounInVerb", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Parameter &quot;subscriptionId&quot; is not allowed in the operations section, define it in the global parameters section instead.
        /// </summary>
        public static string OperationParametersNotAllowedMessage
        {
            get
            {
                return ResourceManager.GetString("OperationParametersNotAllowedMessage", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Operations API must be implemented for &apos;{0}&apos;..
        /// </summary>
        public static string OperationsAPINotImplemented
        {
            get
            {
                return ResourceManager.GetString("OperationsAPINotImplemented", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Parameter Must have the &quot;name&quot; property defined with non-empty string as its value.
        /// </summary>
        public static string ParametersPropertiesValidation
        {
            get
            {
                return ResourceManager.GetString("ParametersPropertiesValidation", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to &apos;PATCH&apos; operation &apos;{0}&apos; should use method name &apos;Update&apos;. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change..
        /// </summary>
        public static string PatchOperationNameNotValid
        {
            get
            {
                return ResourceManager.GetString("PatchOperationNameNotValid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to {0} has different responses for PUT/GET/PATCH operations. The PUT/GET/PATCH operations must have same schema response..
        /// </summary>
        public static string PutGetPatchResponseInvalid
        {
            get
            {
                return ResourceManager.GetString("PutGetPatchResponseInvalid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to &apos;PUT&apos; operation &apos;{0}&apos; should use method name &apos;Create&apos;. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change..
        /// </summary>
        public static string PutOperationNameNotValid
        {
            get
            {
                return ResourceManager.GetString("PutOperationNameNotValid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to A PUT operation request body schema should be the same as its 200 response schema, to allow reusing the same entity between GET and PUT. If the schema of the PUT request body is a superset of the GET response body, make sure you have a PATCH operation to make the resource updatable. Operation: &apos;{0}&apos; Request Model: &apos;{1}&apos; Response Model: &apos;{2}&apos;.
        /// </summary>
        public static string PutOperationRequestResponseSchemaMessage
        {
            get
            {
                return ResourceManager.GetString("PutOperationRequestResponseSchemaMessage", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to The 200 response model for an ARM PUT operation must have x-ms-azure-resource extension set to true in its hierarchy. Operation: &apos;{0}&apos; Model: &apos;{1}&apos;..
        /// </summary>
        public static string PutOperationResourceResponseValidationMessage
        {
            get
            {
                return ResourceManager.GetString("PutOperationResourceResponseValidationMessage", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Property &apos;{0}&apos; is a required property. It should not be marked as &apos;readonly&apos;..
        /// </summary>
        public static string RequiredReadOnlyPropertiesValidation
        {
            get
            {
                return ResourceManager.GetString("RequiredReadOnlyPropertiesValidation", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to A &apos;Resource&apos; definition must have x-ms-azure-resource extension enabled and set to true..
        /// </summary>
        public static string ResourceIsMsResourceNotValid
        {
            get
            {
                return ResourceManager.GetString("ResourceIsMsResourceNotValid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Model definition &apos;{0}&apos; must have the properties &apos;name&apos;, &apos;id&apos; and &apos;type&apos; in its hierarchy and these properties must be marked as readonly..
        /// </summary>
        public static string ResourceModelIsNotValid
        {
            get
            {
                return ResourceManager.GetString("ResourceModelIsNotValid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Every swagger/configuration must have a security definitions section and it must adhere to the structure described in: https://github.com/Azure/autorest/tree/master/docs/developer/validation-rules/security-definitions-structure-validation.md.
        /// </summary>
        public static string SecurityDefinitionsStructureValidation
        {
            get
            {
                return ResourceManager.GetString("SecurityDefinitionsStructureValidation", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Parameter &quot;{0}&quot; is referenced but not defined in the global parameters section of Service Definition.
        /// </summary>
        public static string ServiceDefinitionParametersMissingMessage
        {
            get
            {
                return ResourceManager.GetString("ServiceDefinitionParametersMissingMessage", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Sku Model definition &apos;{0}&apos; is not valid. A Sku model must have &apos;name&apos; property. It can also have &apos;tier&apos;, &apos;size&apos;, &apos;family&apos;, &apos;capacity&apos; as optional properties..
        /// </summary>
        public static string SkuModelIsNotValid
        {
            get
            {
                return ResourceManager.GetString("SkuModelIsNotValid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to The summary and description values should not be same..
        /// </summary>
        public static string SummaryDescriptionVaidationError
        {
            get
            {
                return ResourceManager.GetString("SummaryDescriptionVaidationError", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Azure Resource Management only supports HTTPS scheme..
        /// </summary>
        public static string SupportedSchemesWarningMessage
        {
            get
            {
                return ResourceManager.GetString("SupportedSchemesWarningMessage", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Tracked resource &apos;{0}&apos; must have a get operation..
        /// </summary>
        public static string TrackedResourceGetOperationMissing
        {
            get
            {
                return ResourceManager.GetString("TrackedResourceGetOperationMissing", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to The child tracked resource, &apos;{0}&apos; with immediate parent &apos;{1}&apos;, must have a list by immediate parent operation..
        /// </summary>
        public static string TrackedResourceListByImmediateParentOperationMissing
        {
            get
            {
                return ResourceManager.GetString("TrackedResourceListByImmediateParentOperationMissing", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to For the tracked resource &apos;{0}&apos;, the x-ms-pageable extension values must be same for list by resource group and subscriptions operations..
        /// </summary>
        public static string XMSPagableListByRGAndSubscriptionsMismatch
        {
            get
            {
                return ResourceManager.GetString("XMSPagableListByRGAndSubscriptionsMismatch", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Paths in x-ms-paths must overload a normal path in the paths section, i.e. a path in the x-ms-paths must either be same as a path in the paths section or a path in the paths sections followed by additional parameters..
        /// </summary>
        public static string XMSPathBaseNotInPaths
        {
            get
            {
                return ResourceManager.GetString("XMSPathBaseNotInPaths", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Multiple resource providers are not allowed in a single spec. More than one the resource paths were found: &apos;{0}&apos;..
        /// </summary>
        public static string UniqueResourcePaths
        {
            get
            {
                return ResourceManager.GetString("UniqueResourcePaths", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to The tracked resource, &apos;{0}&apos;, must have a list by resource group operation..
        /// </summary>
        public static string TrackedResourceListByResourceGroupOperationMissing
        {
            get
            {
                return ResourceManager.GetString("TrackedResourceListByResourceGroupOperationMissing", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to The tracked resource, &apos;{0}&apos;, must have a list by subscriptions operation..
        /// </summary>
        public static string TrackedResourceListBySubscriptionsOperationMissing
        {
            get
            {
                return ResourceManager.GetString("TrackedResourceListBySubscriptionsOperationMissing", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Tracked resource &apos;{0}&apos; must have patch operation that at least supports the update of tags..
        /// </summary>
        public static string TrackedResourcePatchOperationMissing
        {
            get
            {
                return ResourceManager.GetString("TrackedResourcePatchOperationMissing", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Property named: &apos;{0}&apos;, for definition: &apos;{1}&apos; must follow camelCase style. Example: &apos;{2}&apos;..
        /// </summary>
        public static string DefinitionsPropertiesNameCamelCase
        {
            get
            {
                return ResourceManager.GetString("DefinitionsPropertiesNameCamelCase", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to &apos;Delete&apos; operation &apos;{0}&apos; must not have a request body..
        /// </summary>
        public static string DeleteMustNotHaveRequestBody
        {
            get
            {
                return ResourceManager.GetString("DeleteMustNotHaveRequestBody", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to &apos;DELETE&apos; operation &apos;{0}&apos; should use method name &apos;Delete&apos;. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change..
        /// </summary>
        public static string DeleteOperationNameNotValid
        {
            get
            {
                return ResourceManager.GetString("DeleteOperationNameNotValid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to The value provided for description is not descriptive enough. Accurate and descriptive description is essential for maintaining reference documentation..
        /// </summary>
        public static string DescriptionNotDescriptive
        {
            get
            {
                return ResourceManager.GetString("DescriptionNotDescriptive", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to &apos;GET&apos; operation &apos;{0}&apos; should use method name &apos;Get&apos; or Method name start with &apos;List&apos;. Note: If you have already shipped an SDK on top of this spec, fixing this warning may introduce a breaking change..
        /// </summary>
        public static string GetOperationNameNotValid
        {
            get
            {
                return ResourceManager.GetString("GetOperationNameNotValid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Guid used in model definition &apos;{1}&apos; for property &apos;{0}&apos;. Usage of Guid is not recommanded. If GUIDs are absolutely required in your service, please get sign off from the Azure API review board..
        /// </summary>
        public static string GuidUsageNotRecommended
        {
            get
            {
                return ResourceManager.GetString("GuidUsageNotRecommended", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Permissible values for HTTP Verb are delete,get,put,patch,head,options,post. .
        /// </summary>
        public static string HttpVerbIsNotValid
        {
            get
            {
                return ResourceManager.GetString("HttpVerbIsNotValid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Inline/anonymous models must not be used, instead define a schema with a model name in the &quot;definitions&quot; section and refer to it. This allows operations to share the models..
        /// </summary>
        public static string AnonymousTypesDiscouraged
        {
            get
            {
                return ResourceManager.GetString("AnonymousTypesDiscouraged", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to API Version must be in the format: yyyy-MM-dd, optionally followed by -preview, -alpha, -beta, -rc, -privatepreview..
        /// </summary>
        public static string APIVersionFormatIsNotValid
        {
            get
            {
                return ResourceManager.GetString("APIVersionFormatIsNotValid", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Top level property names should not be repeated inside the properties bag for ARM resource &apos;{0}&apos;. Properties [{1}] conflict with ARM top level properties. Please rename these..
        /// </summary>
        public static string ArmPropertiesBagValidationMessage
        {
            get
            {
                return ResourceManager.GetString("ArmPropertiesBagValidationMessage", resourceCulture);
            }
        }


        /// <summary>
        ///    Looks up a localized string similar to Found a type set &apos;{0}&apos; which is circularly defined..
        /// </summary>
        public static string CircularBaseSchemaSet
        {
            get
            {
                return ResourceManager.GetString("CircularBaseSchemaSet", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Circular reference detected: {0}.
        /// </summary>
        public static string CircularReference
        {
            get
            {
                return ResourceManager.GetString("CircularReference", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Reference specifies the definition {0} that does not exist..
        /// </summary>
        public static string DefinitionDoesNotExist
        {
            get
            {
                return ResourceManager.GetString("DefinitionDoesNotExist", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Found operation objects with duplicate operationId &apos;{0}&apos;. OperationId must be unique among all operations described in the API..
        /// </summary>
        public static string DuplicateOperationIdException
        {
            get
            {
                return ResourceManager.GetString("DuplicateOperationIdException", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Error parsing swagger file.
        /// </summary>
        public static string ErrorParsingSpec
        {
            get
            {
                return ResourceManager.GetString("ErrorParsingSpec", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Reached Maximum reference depth when resolving reference &apos;{0}&apos;..
        /// </summary>
        public static string ExceededMaximumReferenceDepth
        {
            get
            {
                return ResourceManager.GetString("ExceededMaximumReferenceDepth", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Generating client model from swagger model..
        /// </summary>
        public static string GeneratingClient
        {
            get
            {
                return ResourceManager.GetString("GeneratingClient", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Found incompatible property types {1}, {2} for property &apos;{0}&apos; in schema inheritance chain {3}.
        /// </summary>
        public static string IncompatibleTypesInBaseSchema
        {
            get
            {
                return ResourceManager.GetString("IncompatibleTypesInBaseSchema", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Found incompatible property types {1}, {2} for property &apos;{0}&apos; in schema {3}.
        /// </summary>
        public static string IncompatibleTypesInSchemaComposition
        {
            get
            {
                return ResourceManager.GetString("IncompatibleTypesInSchemaComposition", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Swagger specification is missing info section.
        /// </summary>
        public static string InfoSectionMissing
        {
            get
            {
                return ResourceManager.GetString("InfoSectionMissing", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Input parameter is required..
        /// </summary>
        public static string InputRequired
        {
            get
            {
                return ResourceManager.GetString("InputRequired", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to The schema&apos;s &apos;{0}&apos; ancestors should have at lease one property.
        /// </summary>
        public static string InvalidAncestors
        {
            get
            {
                return ResourceManager.GetString("InvalidAncestors", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Collection format &apos;{0}&apos; is not a valid collection format (in parameter &apos;{1}&apos;)..
        /// </summary>
        public static string InvalidCollectionFormat
        {
            get
            {
                return ResourceManager.GetString("InvalidCollectionFormat", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Cannot use &apos;extend&apos; property with &apos;allOf&apos; property in schema {0}.
        /// </summary>
        public static string InvalidTypeExtendsWithAllOf
        {
            get
            {
                return ResourceManager.GetString("InvalidTypeExtendsWithAllOf", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to &apos;{0}&apos; is not implemented in SwaggerSchema.ToType extension method..
        /// </summary>
        public static string InvalidTypeInSwaggerSchema
        {
            get
            {
                return ResourceManager.GetString("InvalidTypeInSwaggerSchema", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Collection format &quot;multi&quot; is only supported for Query parameters (parameter &apos;{0}&apos;)..
        /// </summary>
        public static string MultiCollectionFormatNotSupported
        {
            get
            {
                return ResourceManager.GetString("MultiCollectionFormatNotSupported", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Method &apos;{0}&apos; does not declare any MIME type for the return body. Generated code will not deserialize the content..
        /// </summary>
        public static string NoProduceOperationWithBody
        {
            get
            {
                return ResourceManager.GetString("NoProduceOperationWithBody", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Options HTTP verb is not supported..
        /// </summary>
        public static string OptionsNotSupported
        {
            get
            {
                return ResourceManager.GetString("OptionsNotSupported", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Parsing swagger json file..
        /// </summary>
        public static string ParsingSwagger
        {
            get
            {
                return ResourceManager.GetString("ParsingSwagger", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Property &apos;{0}&apos; in Model &apos;{1}&apos; is marked readOnly and is also required. This is not allowed..
        /// </summary>
        public static string ReadOnlyNotRequired
        {
            get
            {
                return ResourceManager.GetString("ReadOnlyNotRequired", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Reference path &apos;{0}&apos; does not exist in the definition section of the Swagger document..
        /// </summary>
        public static string ReferenceDoesNotExist
        {
            get
            {
                return ResourceManager.GetString("ReferenceDoesNotExist", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Swagger specification is missing title in info section.
        /// </summary>
        public static string TitleMissing
        {
            get
            {
                return ResourceManager.GetString("TitleMissing", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to Invalid swagger 2.0 specification. Missing version property. .
        /// </summary>
        public static string UnknownSwaggerVersion
        {
            get
            {
                return ResourceManager.GetString("UnknownSwaggerVersion", resourceCulture);
            }
        }

        /// <summary>
        ///    Looks up a localized string similar to The operation &apos;{0}&apos; has a response body in response &apos;{1}&apos;, but did not have a supported MIME type (&apos;application/json&apos; or &apos;application/octet-stream&apos;) in its Produces property..
        /// </summary>
        public static string UnsupportedMimeTypeForResponseBody
        {
            get
            {
                return ResourceManager.GetString("UnsupportedMimeTypeForResponseBody", resourceCulture);
            }
        }
    }
}
