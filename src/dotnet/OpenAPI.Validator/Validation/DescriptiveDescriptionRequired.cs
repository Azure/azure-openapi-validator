// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Collections.Generic;
using System.Linq;
using AutoRest.Core.Utilities;
using OpenAPI.Validator.Model;
using OpenAPI.Validator.Properties;

namespace OpenAPI.Validator.Validation
{
    internal static class DescriptiveDescriptionsExtensions
    {
        private static readonly IEnumerable<string> ImpermissibleDescriptions = new List<string>()
        {
            "description"
        };

        /// <summary>
        /// Determines if the string is a value that is not allowed (case insensitive)
        /// </summary>
        internal static bool IsImpermissibleValue(this string description)
        {
            return ImpermissibleDescriptions.Any(s => s.EqualsIgnoreCase(description));
        }
    }

    public class DescriptiveDescriptionRequired : DescriptionRequired<string>
    {
        /// <summary>
        /// This test passes if the <paramref name="description"/> is not just empty or whitespace and not explictly blocked
        /// </summary>
        /// <param name="description"></param>
        /// <returns></returns>
        public override bool IsValid(string description)
            => !string.IsNullOrWhiteSpace(description) && !description.IsImpermissibleValue();

        /// <summary>
        /// The template message for this Rule. 
        /// </summary>
        /// <remarks>
        /// This may contain placeholders '{0}' for parameterized messages.
        /// </remarks>
        public override string MessageTemplate => Resources.DescriptionNotDescriptive;

        /// <summary>
        /// What kind of open api document type this rule should be applied to
        /// </summary>
        public override ServiceDefinitionDocumentType ServiceDefinitionDocumentType => ServiceDefinitionDocumentType.ARM | ServiceDefinitionDocumentType.DataPlane;

        /// <summary>
        /// The rule could be violated by a model/property referenced by many jsons belonging to the same
        /// composed state, to reduce duplicate messages, run validation rule in composed state
        /// </summary>
        public override ServiceDefinitionDocumentState ValidationRuleMergeState => ServiceDefinitionDocumentState.Composed;
    }
}
