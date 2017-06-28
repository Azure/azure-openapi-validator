﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using AutoRest.Core.Utilities;
using AutoRest.Core.Logging;
using OpenAPI.Validator.Validation.Core;
using OpenAPI.Validator.Properties;
using System;
using System.Collections.Generic;

namespace OpenAPI.Validator.Validation
{
    public class DeleteInOperationName : OperationNameValidation
    {
        /// <summary>
        /// Id of the Rule.
        /// </summary>
        public override string Id => "R1009";

        /// <summary>
        /// The template message for this Rule.
        /// </summary>
        /// <remarks>
        /// This may contain placeholders '{0}' for parameterized messages.
        /// </remarks>
        public override string MessageTemplate => Resources.DeleteOperationNameNotValid;

        /// <summary>
        /// Validates whether PUT operation name is named correctly
        /// </summary>
        /// <param name="entity">Operation name to be verified.</param>
        /// <param name="context">Rule context.</param>
        /// <returns>ValidationMessage</returns>
        public override IEnumerable<ValidationMessage> GetValidationMessages(string operationId, RuleContext context)
        {
            string httpVerb = context?.Parent?.Key;
            if (!String.IsNullOrWhiteSpace(httpVerb) && httpVerb.EqualsIgnoreCase("DELETE") && !IsDeleteValid(operationId))
            {
                yield return new ValidationMessage(new FileObjectPath(context.File, context.Path), this, operationId);
            }
        }
    }
}
