// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Collections.Generic;
using System.IO;
using System.Text;

namespace AutoRest.Core.Utilities
{
    public class MemoryFileSystem
    {
        private Dictionary<string, StringBuilder> _virtualStore = new Dictionary<string, StringBuilder>();

        public Dictionary<string, StringBuilder> VirtualStore => _virtualStore;

        public void WriteAllText(string path, string contents)
            => VirtualStore[path] = new StringBuilder(contents);
        public string ReadAllText(string path)
            => VirtualStore.ContainsKey(path) ? VirtualStore[path].ToString() : throw new IOException("File not found: " + path);
    }
}
