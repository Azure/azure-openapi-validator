// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
// 

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace AutoRest.Core.Utilities.Collections
{
    public static class LinqExtensions
    {
        public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T> enumerable) => enumerable?.Where(each => each != null) ?? Enumerable.Empty<T>();

        public static IEnumerable<TResult> SelectMany<TResult>(this IDictionary source, Func<object,object,IEnumerable<TResult>> selector)
        {
            if (source == null) throw new ArgumentNullException(nameof(source));
            if (selector == null) throw new ArgumentNullException(nameof(selector));
            var e = source.GetEnumerator();
            while (e.MoveNext())
            {
                foreach (TResult subElement in selector(e.Key, e.Value))
                {
                    yield return subElement;
                }
            }
        }

        public static IEnumerable<TResult> SelectMany<TResult>(this IEnumerable source, Func<object, int, IEnumerable<TResult>> selector)
        {
            if (source == null) throw new ArgumentNullException(nameof(source));
            if (selector == null) throw new ArgumentNullException(nameof(selector));
            int index = -1;
            foreach( var item in source )
            {
                index++;
                foreach (TResult subElement in selector(item,index))
                {
                    yield return subElement;
                }
            }
        }
    }
}