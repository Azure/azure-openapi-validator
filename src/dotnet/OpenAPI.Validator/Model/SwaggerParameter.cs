// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Globalization;
using Newtonsoft.Json;
using OpenAPI.Validator;
using System.Collections.Generic;
using OpenAPI.Validator.Core;

namespace OpenAPI.Validator.Model
{
    /// <summary>
    /// Describes a single operation parameter.
    /// https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#parameterObject 
    /// </summary>
    [Rule(typeof(NamePropertyDefinitionInParameter))]
    [Rule(typeof(ParameterDescriptionRequired))]
    [Rule(typeof(XmsClientNameParameter))]
    public class SwaggerParameter : SwaggerObject
    {
        private bool _isRequired;
        public string Name { get; set; }

        public ParameterLocation In { get; set; }

        [JsonProperty(PropertyName = "required")]
        public override bool IsRequired
        {
            get { return (_isRequired) || In == ParameterLocation.Path; }
            set { _isRequired = value; }
        }

        [JsonIgnore]
        public bool IsConstant
        {
            get { return IsRequired && Enum != null && Enum.Count == 1; }
        }

        /// <summary>
        /// The schema defining the type used for the body parameter.
        /// </summary>
        [Rule(typeof(RequiredReadOnlyProperties))]
        public Schema Schema { get; set; }
    }
}