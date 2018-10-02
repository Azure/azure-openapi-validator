// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using AutoRest.Core.Logging;
using OpenAPI.Validator.Model;
using OpenAPI.Validator.Properties;
using OpenAPI.Validator.Validation.Core;
using System.Collections.Generic;
using System.Linq;

namespace OpenAPI.Validator.Validation.Extensions
{
    public class LongRunningOperationsOptionsValidator : TypedRule<Dictionary<string, Operation>>
    {
        /// <summary>
        /// Id of the Rule.
        /// </summary>
        public override string Id => "R2010";

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
        public override string MessageTemplate => Resources.LongRunningOperationsOptionsValidatorMessage;

        /// <summary>
        /// The severity of this message (ie, debug/info/warning/error/fatal, etc)
        /// </summary>
        public override Category Severity => Category.Warning;

        /// <summary>
        /// What kind of open api document type this rule should be applied to
        /// </summary>
        public override ServiceDefinitionDocumentType ServiceDefinitionDocumentType => ServiceDefinitionDocumentType.ARM | ServiceDefinitionDocumentType.DataPlane;

        /// <summary>
        /// What kind of change implementing this rule can cause.
        /// </summary>
        public override ValidationChangesImpact ValidationChangesImpact => ValidationChangesImpact.SDKImpactingChanges;

        /// <summary>
        /// The rule could be violated by a model referenced by many jsons belonging to the same
        /// composed state, to reduce duplicate messages, run validation rule in composed state
        /// </summary>
        public override ServiceDefinitionDocumentState ValidationRuleMergeState => ServiceDefinitionDocumentState.Individual;

        /// <summary>
        /// Validates if a Post LRO Operation with return value has long running operation options extensions enabled.
        /// </summary>
        /// <param name="operationPaths"></param>
        /// <param name="context"></param>
        /// <returns>true if a Post LRO Operation with return value has long running operation options extensions enabled. false otherwise.</returns>
        public override IEnumerable<ValidationMessage> GetValidationMessages(Dictionary<string, Operation> operationPaths, RuleContext context)
        {
            Operation operation = null;
            // Check if there is a post operation. We are not considering any other operation for this rule.
            if (operationPaths.TryGetValue("post", out operation))
            {
                // We are considering the "post" operations which are long running
                if (operation.Extensions.ContainsKey("x-ms-long-running-operation"))
                {
                    // We are considering only the "post" LRO operations which have schema defined.
                    // So, first determine if there is a schema defined for any response type of "2xx".
                    bool schemaAvailable = false;
                    foreach (KeyValuePair<string, OperationResponse> keyResponse in operation.Responses)
                    {
                        if (keyResponse.Key.StartsWith("2") && keyResponse.Value.Schema != null)
                        {
                            schemaAvailable = true;
                            break;
                        }
                    }

                    if (schemaAvailable && !operation.Extensions.ContainsKey("x-ms-long-running-operation-options"))
                    {
                        yield return new ValidationMessage(new FileObjectPath(context.File, context.Path), this);
                    }
                }
            }
        }
    }
}
