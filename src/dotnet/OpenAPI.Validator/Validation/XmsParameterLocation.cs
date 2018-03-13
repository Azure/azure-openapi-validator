// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using AutoRest.Core.Logging;
using OpenAPI.Validator.Properties;
using OpenAPI.Validator.Validation.Core;
using OpenAPI.Validator.Model;
using System.Collections.Generic;
using System.Linq;

namespace OpenAPI.Validator.Validation
{
    public class XmsParameterLocation : TypedRule<SwaggerParameter>
    {
        private static readonly IEnumerable<string> AllowedGlobalParameters = new List<string>()
        { "subscriptionid", "api-version", "apiversion", "subscription-id" };

        /// <summary>
        /// Id of the Rule.
        /// </summary>
        public override string Id => "R4001";

        /// <summary>
        /// Violation category of the Rule.
        /// </summary>
        public override ValidationCategory ValidationCategory => ValidationCategory.SDKViolation;

        /// <summary>
        /// The template message for this Rule. 
        /// </summary>
        /// <remarks>
        /// This may contain placeholders '{0}' for parameterized messages.
        /// </remarks>
        public override string MessageTemplate => Resources.XmsParameterLocation;

        /// <summary>
        /// The severity of this message (ie, debug/info/warning/error/fatal, etc)
        /// </summary>
        public override Category Severity => Category.Error;

        /// <summary>
        /// What kind of open api document type this rule should be applied to
        /// </summary>
        public override ServiceDefinitionDocumentType ServiceDefinitionDocumentType => ServiceDefinitionDocumentType.ARM;

        /// <summary>
        /// What state of the document to run the validation rule on
        /// </summary>
        public override ServiceDefinitionDocumentState ValidationRuleMergeState => ServiceDefinitionDocumentState.Individual;

        public override IEnumerable<ValidationMessage> GetValidationMessages(SwaggerParameter parameter, RuleContext context)
        {
            if (!AllowedGlobalParameters.Contains(parameter.Name.ToLower()) &&
               parameter.Extensions?.Keys?.Contains("x-ms-parameter-location") == false)
            {
                yield return new ValidationMessage(new FileObjectPath(context.File, context.Path), this, parameter.Name);
            }
        }
    }
}
