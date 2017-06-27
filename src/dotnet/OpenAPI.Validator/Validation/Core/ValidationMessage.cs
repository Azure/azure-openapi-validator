// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using AutoRest.Core.Logging;
using System;
using System.Globalization;

namespace OpenAPI.Validator.Validation.Core
{
    /// <summary>
    /// Represents a single validation violation.
    /// </summary>
    public class ValidationMessage
    {
        public static bool Verbose { get; set; }

        public ValidationMessage(FileObjectPath path, Rule rule, params object[] formatArguments)
        {
            Rule = rule;
            Severity = rule.Severity;
            Message = $"{string.Format(CultureInfo.CurrentCulture, rule.MessageTemplate, formatArguments)}";
            Path = path;

            if (Verbose)
            {
                var stackTrace = Environment.StackTrace;

                // cut away logging part
                var lastMention = stackTrace.LastIndexOf(typeof(ValidationMessage).Namespace);
                stackTrace = stackTrace.Substring(lastMention);
                // skip to next stack frame
                stackTrace = stackTrace.Substring(stackTrace.IndexOf('\n') + 1);

                VerboseData = stackTrace;
            }
        }

        public Category Severity { get; }

        public string Message { get; }

        /// <summary>
        /// The JSON document path to the element being validated.
        /// </summary>
        public FileObjectPath Path { get; }

        /// <summary>
        /// Additional data, set only if `ValidationMessage.Verbose` is set.
        /// </summary>
        public string VerboseData { get; } = null;

        /// <summary>
        /// The validation rule which triggered this message.
        /// </summary>
        public Rule Rule { get; }
    }
}
