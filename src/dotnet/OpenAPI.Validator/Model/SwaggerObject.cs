// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;
using AutoRest.Core.Model;
using OpenAPI.Validator.Validation;
using Newtonsoft.Json;
using OpenAPI.Validator.Validation.Core;

namespace OpenAPI.Validator.Model
{
    /// <summary>
    /// Describes a single operation determining with this object is mandatory.
    /// https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#parameterObject
    /// </summary>
    [Rule(typeof(DefaultMustBeInEnum))]
    public abstract class SwaggerObject : SwaggerBase
    {
        public virtual bool IsRequired { get; set; }

        /// <summary>
        /// The type of the parameter.
        /// </summary>
        public virtual DataType? Type { get; set; }

        /// <summary>
        /// The extending format for the previously mentioned type.
        /// </summary>
        [Rule(typeof(ValidFormats))]
        public virtual string Format { get; set; }

        /// <summary>
        /// Returns the KnownFormat of the Format string (provided it matches a KnownFormat)
        /// Otherwise, returns KnownFormat.none
        /// </summary>
        public KnownFormat KnownFormat => string.IsNullOrWhiteSpace(Format)
            ? KnownFormat.none
            : System.Enum.TryParse(Format.Replace('-', '_'), true, out KnownFormat result) ? result : KnownFormat.unknown;

        /// <summary>
        /// Describes the type of items in the array.
        /// </summary>
        [Rule(typeof(RequiredReadOnlyProperties))]
        public virtual Schema Items { get; set; }

        [JsonProperty(PropertyName = "$ref")]
        public string Reference { get; set; }

        /// <summary>
        /// Describes the type of additional properties in the data type.
        /// </summary>
        public virtual Schema AdditionalProperties { get; set; }

        [Rule(typeof(DescriptiveDescriptionRequired))]
        public virtual string Description { get; set; }

        /// <summary>
        /// Determines the format of the array if type array is used.
        /// </summary>
        public virtual CollectionFormat CollectionFormat { get; set; }

        /// <summary>
        /// Sets a default value to the parameter.
        /// </summary>
        public virtual string Default { get; set; }

        public virtual string MultipleOf { get; set; }

        public virtual string Maximum { get; set; }

        public virtual bool ExclusiveMaximum { get; set; }

        public virtual string Minimum { get; set; }

        public virtual bool ExclusiveMinimum { get; set; }

        public virtual string MaxLength { get; set; }

        public virtual string MinLength { get; set; }

        public virtual string Pattern { get; set; }

        public virtual string MaxItems { get; set; }

        public virtual string MinItems { get; set; }

        public virtual bool UniqueItems { get; set; }

        public virtual IList<string> Enum { get; set; }
    }
}