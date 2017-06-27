using AutoRest.Core.Logging;
using Newtonsoft.Json;
using System;
using System.Globalization;
using System.IO;
using System.Linq;
using YamlDotNet.RepresentationModel;
using YamlDotNet.Serialization;

namespace AutoRest.Core.Parsing
{
    public static class YamlExtensions
    {
        private static Deserializer YamlDeserializer
        {
            get
            {
                var d = new Deserializer();
                d.NodeDeserializers.Insert(0, new YamlBoolDeserializer());
                return d;
            }
        }
        private static JsonSerializer JsonSerializer => new JsonSerializer();

        /// <summary>
        /// Converts the YAML document to JSON.
        /// </summary>
        public static string EnsureYamlIsJson(this string text)
        {
            using (var reader = new StringReader(text))
            {
                using (var writer = new StringWriter(CultureInfo.CurrentCulture))
                {
                    var obj = YamlDeserializer.Deserialize(reader);
                    JsonSerializer.Serialize(writer, obj);
                    return writer.ToString();
                }
            }
        }
    }
}
