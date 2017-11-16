// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

// Copied from https://github.com/Azure/autorest.common/blob/ab329b81f963405023b0282209b2f547c551c55a/src/JsonRpc/CallerResponse.cs#L39

namespace Microsoft.Perks.JsonRPC
{
    public interface ICallerResponse
    {
        bool SetCompleted(JToken result);
        bool SetException(JToken error);
        bool SetCancelled();
    }

    public class CallerResponse<T> : TaskCompletionSource<T>, ICallerResponse
    {
        public string Id { get; private set; }
        private Action<JObject> _setResult;

        public CallerResponse(string id, Action<JObject> setResult)
        {
            Id = id;
            _setResult = setResult;
        }
        public CallerResponse(string id)
        {
            Id = id;
        }

        public bool SetCompleted(JToken result)
        {
            T value;
            Func<object, bool> trueLikeValue = obj => obj != null && !0.Equals(obj) && !false.Equals(obj) && !"".Equals(obj);
            if (typeof(T) == typeof(bool))
            {
                var obj = result.ToObject<object>();
                value = (T)(object)(trueLikeValue(obj));
            }
            else if (typeof(T) == typeof(bool?))
            {
                var obj = result.ToObject<object>();
                value = obj == null ? (T)(object)(null) : (T)(object)(trueLikeValue(obj));
            }
            else
            {
                value = result.ToObject<T>();
            }
            return TrySetResult(value);
        }

        public bool SetException(JToken error)
        {
            return TrySetException(error.ToObject<Exception>());
        }

        public bool SetCancelled()
        {
            return TrySetCanceled();
        }
    }
}