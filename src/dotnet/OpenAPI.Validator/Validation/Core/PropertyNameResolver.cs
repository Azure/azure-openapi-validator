// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using AutoRest.Core.Utilities;
using Newtonsoft.Json;
using System.Linq;
using System.Reflection;

namespace OpenAPI.Validator.Validation.Core
{
    public static class PropertyNameResolver
    {
        /// <summary>
        /// Returns the name specified by a JsonProperty attribute if it exists, otherwise the property name
        /// </summary>
        /// <param name="prop"></param>
        /// <returns>The [JsonProperty] name of property if it exists, or the property name</returns>
        public static string JsonName(PropertyInfo prop)
            => prop?.GetCustomAttributes<JsonPropertyAttribute>(true).Select(p => p.PropertyName).FirstOrDefault()
            ?? prop.Name.ToCamelCase();
    }
}
