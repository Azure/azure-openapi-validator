using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using AutoRest.Core.Utilities.Collections;
using AutoRest.Core.Utilities;
using OpenAPI.Validator.Model;
using AutoRest.Core.Model;

namespace OpenAPI.Validator.Validation.Core
{
    internal static class RulesExtensions
    {
        /// <summary>
        /// Gets an enumerable of properties for <paramref name="entity" /> that can be validated
        /// </summary>
        /// <param name="entity">The object to get properties for</param>
        /// <returns></returns>
        internal static IEnumerable<PropertyInfo> GetValidatableProperties(this object entity)
            => entity.GetType().GetProperties(BindingFlags.FlattenHierarchy | BindingFlags.Public | BindingFlags.Instance)
                ?? Enumerable.Empty<PropertyInfo>();

        /// <summary>
        /// Properties of type object can cause infinite iteration if recursively traversed
        /// </summary>
        /// <param name="prop"></param>
        /// <returns></returns>
        internal static bool IsTraversableProperty(this PropertyInfo prop) => prop.PropertyType != typeof(object);

        /// <summary>
        /// Determines if a dictionary's elements should be recursively traversed
        /// Dictionaries where there isn't type information for the value type should not be
        /// traversed, since there isn't enough information to prevent infinite traversal
        /// </summary>
        /// <param name="entity">The object to check</param>
        /// <returns></returns>
        internal static bool IsTraversableDictionary(this object entity)
        {
            if (entity == null)
            {
                return false;
            }
            // Dictionaries of type <string, object> cannot be traversed, because the object could be infinitely deep.
            // We only want to validate objects that have strong typing for the value type
            var dictType = entity.GetType();
            return dictType.IsGenericType() &&
                   dictType.GenericTypeArguments.Count() >= 2 &&
                   dictType.GenericTypeArguments[1] != typeof(object);
        }

        /// <summary>
        /// A schema represents a simple primary type if it's a stream, or an object with no properties
        /// </summary>
        /// <param name="_schema"></param>
        /// <returns></returns>
        public static KnownPrimaryType GetSimplePrimaryType(this Schema _schema)
        {
            // If object with file format treat as stream
            if (_schema.Type != null
                && _schema.Type == DataType.Object
                && "file".EqualsIgnoreCase(_schema.Format))
            {
                return KnownPrimaryType.Stream;
            }

            // If the object does not have any properties, treat it as raw json (i.e. object)
            if (_schema.Properties.IsNullOrEmpty() && string.IsNullOrEmpty(_schema.Extends) && _schema.AdditionalProperties == null)
            {
                return KnownPrimaryType.Object;
            }

            // The schema doesn't match any KnownPrimaryType
            return KnownPrimaryType.None;
        }

        /// <summary>
        /// A schema represents a CompositeType if it's not a primitive type and it's not a simple primary type
        /// </summary>
        /// <param name="schema"></param>
        /// <returns></returns>
        public static bool RepresentsCompositeType(this Schema schema)
        {
            return !schema.IsPrimitiveType() && schema.GetSimplePrimaryType() == KnownPrimaryType.None;
        }

        /// <summary>
        /// A schema represents a primitive type if it's not an object or it represents a dictionary
        /// </summary>
        /// <param name="_schema"></param>
        /// <returns></returns>
        public static bool IsPrimitiveType(this Schema _schema)
        {
            // Notes: 
            //      'additionalProperties' on a type AND no defined 'properties', indicates that
            //      this type is a Dictionary. (and is handled by ObjectBuilder)
            return (_schema.Type != null && _schema.Type != DataType.Object || (_schema.AdditionalProperties != null && _schema.Properties.IsNullOrEmpty()));
        }

        public static IEnumerable<Rule> GetValidationRules(this PropertyInfo property) =>  property.GetCustomAttributes<RuleAttribute>(true).Select(each => each.Rule).ToList();

        public static IEnumerable<Rule> GetValidationCollectionRules(this PropertyInfo property) => property.GetCustomAttributes<CollectionRuleAttribute>(true).Select(each => each.Rule).ToList();

        public static IEnumerable<Rule> GetValidationRules(this Type type) => type.GetCustomAttributes<RuleAttribute>(true).Select(each => each.Rule).ToList();

    }
}