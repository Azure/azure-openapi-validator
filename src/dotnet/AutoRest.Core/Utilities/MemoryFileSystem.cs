// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


using AutoRest.Core.Properties;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace AutoRest.Core.Utilities
{
    public class MemoryFileSystem
    {
        private Dictionary<string, StringBuilder> _virtualStore = new Dictionary<string, StringBuilder>();

        public Dictionary<string, StringBuilder> VirtualStore => _virtualStore;

        public void WriteAllText(string path, string contents)
            => VirtualStore[path] = new StringBuilder(contents);
        public string ReadAllText(string path)
        {
            if (VirtualStore.ContainsKey(path))
            {
                return VirtualStore[path].ToString();
            }
            else if (VirtualStore.ContainsKey(path.Replace("\\", "/")))
            {
                return VirtualStore[path.Replace("\\", "/")].ToString();
            }
            else if (VirtualStore.ContainsKey(path.Replace("/", "\\")))
            {
                return VirtualStore[path.Replace("/", "\\")].ToString();
            }

            throw new IOException("File not found: " + path);
        }
    }
}
