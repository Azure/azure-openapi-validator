﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using AutoRest.Core.Logging;
using OpenAPI.Validator.Model;
using OpenAPI.Validator.Properties;
using OpenAPI.Validator.Validation.Core;
using System.Collections.Generic;

namespace OpenAPI.Validator.Validation
{
    public class OperationDescriptionOrSummaryRequired : DescriptionRequired<Operation>
    {

        /// <summary>
        /// Id of the Rule.
        /// </summary>
        public override string Id => "R4022";

        /// <summary>
        /// The template message for this Rule.
        /// </summary>
        /// <remarks>
        /// This may contain placeholders '{0}' for parameterized messages.
        /// </remarks>
        public override string MessageTemplate => Resources.MissingSummaryDescription;

        /// <summary>
        /// What kind of open api document type this rule should be applied to
        /// </summary>
        public override ServiceDefinitionDocumentType ServiceDefinitionDocumentType => ServiceDefinitionDocumentType.ARM | ServiceDefinitionDocumentType.DataPlane;

        /// <summary>
        /// The rule runs on each operation in isolation irrespective of the state and can be run in individual state
        /// </summary>
        public override ServiceDefinitionDocumentState ValidationRuleMergeState => ServiceDefinitionDocumentState.Individual;

        /// <summary>
        /// This rule fails if the description and summary is null and their references are null
        /// </summary>
        /// <param name="entity">Entity being validated</param>
        /// <param name="context">Rule context</param>
        /// <returns>list of ValidationMessages</returns> 
        public override IEnumerable<ValidationMessage> GetValidationMessages(Operation entity, RuleContext context)
        {
            if (string.IsNullOrWhiteSpace(entity.Description) && string.IsNullOrWhiteSpace(entity.Summary))
            {
                yield return new ValidationMessage(new FileObjectPath(context.File, context.Path), this, entity.OperationId);
            }

        }
    }
}
