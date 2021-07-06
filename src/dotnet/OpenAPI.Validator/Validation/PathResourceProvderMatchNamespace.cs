// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using AutoRest.Core.Logging;
using OpenAPI.Validator.Properties;
using OpenAPI.Validator.Model;
using OpenAPI.Validator.Model.Utilities;
using OpenAPI.Validator.Validation.Core;
using System.Collections.Generic;
using System.Linq;

namespace OpenAPI.Validator.Validation
{
    public class PathResourceProviderMatchNamespace : TypedRule<Dictionary<string, Dictionary<string, Operation>>>
    {
        /// <summary>
        /// Id of the Rule.
        /// </summary>
        public override string Id => "R3030";

        /// <summary>
        /// Violation category of the Rule.
        /// </summary>
        public override ValidationCategory ValidationCategory => ValidationCategory.ARMViolation;

        /// <summary>
        /// The severity of this message (ie, debug/info/warning/error/fatal, etc)
        /// </summary>
        public override Category Severity => Category.Error;

        /// <summary>
        /// The template message for this Rule. 
        /// </summary>
        /// <remarks>
        /// This may contain placeholders '{0}' for parameterized messages.
        /// </remarks>
        public override string MessageTemplate => Resources.PathResourceProviderMatchNamespace;

        /// <summary>
        /// What kind of open api document type this rule should be applied to
        /// </summary>
        public override ServiceDefinitionDocumentType ServiceDefinitionDocumentType => ServiceDefinitionDocumentType.ARM;

        /// <summary>
        /// A single json must contain only one resource, hence needs to be run on the individual state
        /// </summary>
        public override ServiceDefinitionDocumentState ValidationRuleMergeState => ServiceDefinitionDocumentState.Individual;

        /// <summary>
        /// This rule passes if the paths contain reference to exactly one of the namespace resources
        /// </summary>
        /// <param name="paths"></param>
        /// <returns></returns>
        public override IEnumerable<ValidationMessage> GetValidationMessages(Dictionary<string, Dictionary<string, Operation>> paths, RuleContext context)
        {
            string resourceProviderNamespace = ValidationUtilities.GetRPNamespaceFromFilePath(context.File.ToString());
            foreach (var pair in paths) {
                IEnumerable<string> resourceProviders = ValidationUtilities.GetResourceProvidersByPath(pair.Key);
                var formatParameters = new[] { string.Join(", ", resourceProviders) };
                string lastResourceProvider = resourceProviders?.ToList().Count() > 0 ? resourceProviders.Last() : null;
                if (resourceProviderNamespace != "" && resourceProviders.ToList().Count > 0 && lastResourceProvider != resourceProviderNamespace)
                {
                    yield return new ValidationMessage(new FileObjectPath(context.File, context.Path.AppendProperty(pair.Key)), this, formatParameters);
                }
            }
            
        }
    }
}
