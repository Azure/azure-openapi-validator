// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using AutoRest.Core.Logging;
using OpenAPI.Validator.Validation.Core;
using OpenAPI.Validator.Properties;
using System.Collections.Generic;
using OpenAPI.Validator.Model;
using System.Linq;
using OpenAPI.Validator;

namespace OpenAPI.Validator.Validation
{
    public class ArmResourcePropertiesBag : TypedRule<Dictionary<string, Schema>>
    {
        /// <summary>
        /// Id of the Rule.
        /// </summary>
        public override string Id => "R3019";

        /// <summary>
        /// Violation category of the Rule.
        /// </summary>
        public override ValidationCategory ValidationCategory => ValidationCategory.RPCViolation;

        /// <summary>
        /// The template message for this Rule. 
        /// </summary>
        /// <remarks>
        /// This may contain placeholders '{0}' for parameterized messages.
        /// </remarks>
        public override string MessageTemplate => Resources.ArmPropertiesBagValidationMessage;

        /// <summary>
        /// The severity of this message (ie, debug/info/warning/error/fatal, etc)
        /// </summary>
        public override Category Severity => Category.Error;

        /// <summary>
        /// What kind of open api document type this rule should be applied to
        /// </summary>
        public override ServiceDefinitionDocumentType ServiceDefinitionDocumentType => ServiceDefinitionDocumentType.ARM;

        /// <summary>
        /// The rule could be violated by a model referenced by many jsons belonging to the same
        /// composed state, to reduce duplicate messages, run validation rule in composed state
        /// </summary>
        public override ServiceDefinitionDocumentState ValidationRuleMergeState => ServiceDefinitionDocumentState.Composed;

        private static readonly IEnumerable<string> ArmPropertiesBag = new List<string>()
                                                                        { "name", "id", "type", "location", "tags" };

        // Verifies whether ARM resource has the set of properties repeated in its property bag
        public override IEnumerable<ValidationMessage> GetValidationMessages(Dictionary<string, Schema> definitions, RuleContext context)
        {
            IEnumerable<string> resourceModelsWithPropertiesBag = context.ResourceModels.Where(resourceModel => definitions[resourceModel].Properties?.ContainsKey("properties") == true);
            foreach(string resourceModelName in resourceModelsWithPropertiesBag)
            {
                Dictionary<string, IEnumerable<string>> violations = new Dictionary<string, IEnumerable<string>>();             
                CheckModelForViolation(definitions[resourceModelName], resourceModelName, definitions, context, violations);

                foreach (string modelName in violations.Keys)
                {
                    yield return new ValidationMessage(new FileObjectPath(context.File,
                    context.Path.AppendProperty(modelName).AppendProperty("properties")), this, modelName,
                                                   string.Join(", ", violations[modelName]));
                }
            }
        }

        /// <summary>
        /// Method to check the model for violation of this rule.
        /// This method checks if the model has propeties bag. If so and it
        /// has reference then the reference is processed. Else, the individual
        /// properties are checked for violation.
        ///
        /// Then, if the model has allOf's, they need to be processed individually.
        /// </summary>
        /// <param name="resourceModel">schema of the model</param>
        /// <param name="resourceModelName">name of the model</param>
        /// <param name="definitions">definitions</param>
        /// <param name="context">context</param>
        /// <param name="violations">violations table</param>
        private void CheckModelForViolation(Schema resourceModel, string resourceModelName, Dictionary<string, Schema> definitions, RuleContext context, Dictionary<string, IEnumerable<string>> violations)
        {
            if(resourceModel != null)
            {
                if (resourceModel.Properties?.ContainsKey("properties") == true)
                {
                    string referenceName = resourceModel.Properties["properties"].Reference;
                    if (!string.IsNullOrWhiteSpace(referenceName))
                    {
                        CheckModelForViolation(Schema.FindReferencedSchema(referenceName, definitions), Validator.Extensions.StripDefinitionPath(referenceName), definitions, context, violations);
                    }
                    else
                    {
                        IEnumerable<string> violatingProperties = resourceModel.Properties["properties"].Properties?.Keys?.Intersect(ArmPropertiesBag);
                        if (violatingProperties.Any() == true)
                        {
                            violations[resourceModelName] = violatingProperties;
                        }
                    }
                }

                if (resourceModel.AllOf != null)
                {
                    foreach (Schema schema in resourceModel.AllOf)
                    {
                        CheckModelForViolation(Schema.FindReferencedSchema(schema.Reference, definitions), Validator.Extensions.StripDefinitionPath(schema.Reference), definitions, context, violations);
                    }
                }
            }
        }
    }
}


