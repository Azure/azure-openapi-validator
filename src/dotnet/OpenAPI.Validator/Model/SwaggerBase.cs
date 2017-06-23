// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using OpenAPI.Validator.Validation;
using OpenAPI.Validator.Validation.Core;

namespace OpenAPI.Validator.Model
{
    public abstract class SwaggerBase
    {
        public SwaggerBase()
        {
            Extensions = new Dictionary<string, object>();
        }

        /// <summary>
        /// Vendor extensions.
        /// </summary>
        [JsonExtensionData]
        [CollectionRule(typeof(NonEmptyClientName))]
        [CollectionRule(typeof(NextLinkPropertyMustExist))]
        [CollectionRule(typeof(PageableRequires200Response))]
        [CollectionRule(typeof(LongRunningResponseStatusCode))]
        [CollectionRule(typeof(MutabilityWithReadOnly))]
        public Dictionary<string, object> Extensions { get; set; }
    }
}