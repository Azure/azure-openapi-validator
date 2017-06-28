// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Net;
using AutoRest.Core.Model;
using System.Linq;

namespace OpenAPI.Validator
{
    /// <summary>
    /// Provides useful extension methods to simplify common coding tasks.
    /// </summary>
    public static class Extensions
    {
        private static string FormatCase(string name, bool toLower)
        {
            if (!string.IsNullOrEmpty(name))
            {
                if ((name.Length < 2) || ((name.Length == 2) && char.IsUpper(name[0]) && char.IsUpper(name[1])))
                {
                    name = toLower ? name.ToLowerInvariant() : name.ToUpperInvariant();
                }
                else
                {
                    name =
                    (toLower
                        ? char.ToLowerInvariant(name[0])
                        : char.ToUpperInvariant(name[0])) + name.Substring(1, name.Length - 1);
                }
            }
            return name;
        }

        public static string ToCamelCase(this string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return value;
            }

            if (value[0] == '_')
            // Preserve leading underscores.
            {
                return '_' + ToCamelCase(value.Substring(1));
            }

            return
                value.Split('_', '-', ' ')
                    .Where(s => !string.IsNullOrEmpty(s))
                    .Select((s, i) => FormatCase(s, i == 0)) // Pass true/toLower for just the first element.
                    .DefaultIfEmpty("")
                    .Aggregate(string.Concat);
        }

        public static bool EqualsIgnoreCase(this string s1, string s2) => ReferenceEquals(s1, s2) || true == s1?.Equals(s2, StringComparison.OrdinalIgnoreCase);

        public static HttpStatusCode ToHttpStatusCode(this string statusCode)
        {
            return (HttpStatusCode)Enum.Parse(typeof(HttpStatusCode), statusCode);
        }

        public static HttpMethod ToHttpMethod(this string verb)
        {
            if (verb == null)
            {
                throw new ArgumentNullException("verb");
            }

            switch (verb.ToLower())
            {
                case "get":
                    return HttpMethod.Get;
                case "post":
                    return HttpMethod.Post;
                case "put":
                    return HttpMethod.Put;
                case "head":
                    return HttpMethod.Head;
                case "delete":
                    return HttpMethod.Delete;
                case "patch":
                    return HttpMethod.Patch;
                case "options":
                    return HttpMethod.Options;
                default:
                    throw new NotImplementedException();
            }
        }

        /// <summary>
        /// Removes #/definitions/ or url#/definitions from the reference path.
        /// </summary>
        /// <param name="reference">Definition reference.</param>
        /// <returns>Definition name with path.</returns>
        public static string StripDefinitionPath(this string reference)
        {
            if (reference != null && reference.Contains("#/definitions/"))
            {
                reference = reference.Substring(reference.IndexOf("#/definitions/", StringComparison.OrdinalIgnoreCase) +
                    "#/definitions/".Length);
            }

            return reference;
        }

        /// <summary>
        /// Removes #/parameters/ or url#/parameters from the reference path.
        /// </summary>
        /// <param name="reference">Parameter reference.</param>
        /// <returns>Parameter name with path.</returns>
        public static string StripParameterPath(this string reference)
        {
            if (reference != null && reference.Contains("#/parameters/"))
            {
                reference = reference.Substring(reference.IndexOf("#/parameters/", StringComparison.OrdinalIgnoreCase) +
                    "#/parameters/".Length);
            }

            return reference;
        }
    }
}