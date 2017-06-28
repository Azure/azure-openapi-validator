// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json;
using System.Linq;
using AutoRest.Core.Utilities;
using System.Text.RegularExpressions;
using YamlDotNet.RepresentationModel;

namespace AutoRest.Core.Logging
{
    public class ObjectPathPartProperty : ObjectPathPart
    {
        public ObjectPathPartProperty(string property)
        {
            Property = property;
        }

        public string Property { get; }

        public override object RawPath => Property;
    }
}
