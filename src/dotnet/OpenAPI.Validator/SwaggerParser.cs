// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using AutoRest.Core.Parsing;
using AutoRest.Core.Utilities;
using OpenAPI.Validator.JsonConverters;
using OpenAPI.Validator.Model;
using Newtonsoft.Json;

namespace OpenAPI.Validator
{
    public static class SwaggerParser
    {
        public static ServiceDefinition Load(string path, MemoryFileSystem fileSystem)
        {
            if (fileSystem == null)
            {
                throw new ArgumentNullException("fileSystem");
            }

            var swaggerDocument = fileSystem.ReadAllText(path);
            return Parse(path, swaggerDocument);
        }

        public static string Normalize(string path, string swaggerDocument)
        {
            // normalize YAML to JSON since that's what we process
            swaggerDocument = swaggerDocument.EnsureYamlIsJson();
            return swaggerDocument;
        }

        public static ServiceDefinition Parse(string path, string swaggerDocument)
        {
            swaggerDocument = Normalize(path, swaggerDocument);
            var settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.None,
                MetadataPropertyHandling = MetadataPropertyHandling.Ignore
            };
            settings.Converters.Add(new ResponseRefConverter(swaggerDocument));
            settings.Converters.Add(new PathItemRefConverter(swaggerDocument));
            settings.Converters.Add(new PathLevelParameterConverter(swaggerDocument));
            settings.Converters.Add(new SchemaRequiredItemConverter());
            settings.Converters.Add(new SecurityDefinitionConverter());
            return JsonConvert.DeserializeObject<ServiceDefinition>(swaggerDocument, settings);
        }
    }
}
