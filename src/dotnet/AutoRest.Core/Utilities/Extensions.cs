// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using AutoRest.Core.Logging;

#pragma warning disable CS3024 // Constraint type is not CLS-compliant
namespace AutoRest.Core.Utilities
{
    /// <summary>
    /// Provides useful extension methods to simplify common coding tasks.
    /// </summary>
    public static class Extensions
    {
        /// <summary>
        /// Returns a collection of the descendant elements for this collection.
        /// </summary>
        /// <typeparam name='T'>Type of elements in the sequence.</typeparam>
        /// <param name="items">Child collection</param>
        /// <param name="childSelector">Child selector</param>
        /// <returns>List of all items and descendants of each item</returns>
        [SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures", Justification = "By design.")]
        public static IEnumerable<T> Descendants<T>(this IEnumerable<T> items, Func<T, IEnumerable<T>> childSelector)
        {
            foreach (var item in items)
            {
                foreach (var childResult in childSelector(item).Descendants(childSelector))
                    yield return childResult;
                yield return item;
            }
        }

        /// <summary>
        ///     Determines whether the collection object is either null or an empty collection.
        /// </summary>
        /// <typeparam name="T"> </typeparam>
        /// <param name="collection"> The collection. </param>
        /// <returns>
        ///     <c>true</c> if [is null or empty] [the specified collection]; otherwise, <c>false</c> .
        /// </returns>
        /// <remarks>
        /// </remarks>
        public static bool IsNullOrEmpty<T>(this IEnumerable<T> collection) => collection == null || !collection.Any();
        public static bool IsEnum(this Type type) => type.GetTypeInfo().IsEnum;
        public static IEnumerable<T> GetCustomAttributes<T>(this Type type, bool inherit) where T : Attribute => type.GetTypeInfo().GetCustomAttributes<T>(inherit);
        public static bool IsGenericType(this Type type) => type.GetTypeInfo().IsGenericType;
        public static IEnumerable<CustomAttributeData> CustomAttributes(this Type type) => type.GetTypeInfo().CustomAttributes;
        public static bool IsClass(this Type type) => type.GetTypeInfo().IsClass;

        public static string CodeBaseDirectory
        {
            get
            {
                dynamic a = typeof(ObjectPath).GetTypeInfo().Assembly;
                return Directory.GetParent(a.Location.ToString()).ToString();
            }
        }

        public static T? Get<T>(this IDictionary<string, object> dictionary, string key) where T : struct, IComparable, IConvertible

        {
            if (dictionary.TryGetValue(key, out object value))
            {
                if (typeof(T).IsEnum())
                {
                    return (T)Enum.Parse(typeof(T), value.ToString(), true);
                }

                if (value is T)
                {
                    return (T) value;
                }

                try
                {
                    return (T) Convert.ChangeType(value, typeof(T));
                }
                catch
                {
                    return null;
                }
            }
            return null;
        }

        public static T GetValue<T>(this IDictionary<string, object> dictionary, string key) where T:class
        {
            if (dictionary.TryGetValue(key, out object value))
            {
                if (value is T)
                {
                    return (T) value;
                }
                try
                {
                    return (T)Convert.ChangeType(value, typeof(T));
                }
                catch
                {
                    return null;
                }
            }
            return null;
        }

        public static string StripControlCharacters(this string input)
        {
            return string.IsNullOrWhiteSpace(input) ? input : Regex.Replace(input, @"[\ca-\cz-[\cj\cm\ci]]", string.Empty);
        }
    }
}