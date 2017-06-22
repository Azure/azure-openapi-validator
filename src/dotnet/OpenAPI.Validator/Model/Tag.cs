// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.



namespace OpenAPI.Validator.Model
{
    /// <summary>
    /// Represents a Swagger Tag
    /// </summary>
    public class Tag : SwaggerBase
    {
        private string _description;
        public string Name { get; set; }

        public string Description
        {
            get { return _description; }
            set { _description = value.StripControlCharacters(); }
        }

        public ExternalDoc ExternalDoc { get; set; }
    }
}