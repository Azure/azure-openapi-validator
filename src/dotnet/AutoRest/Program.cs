// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace AutoRest
{
    internal class Program
    {
        private static int Main(string[] args)
        {
            if (args != null && args?.Length > 0 && args[0] == "--server")
            {
                return new AutoRestAsAsService().Run().Result;
            }

            Console.WriteLine("This is an Azure OpenAPI Validator extension to AutoRest.");
            Console.WriteLine("It cannot be used as a standalone tool.");
            Console.WriteLine("Please use AutoRest to use the validator (flag: azure-validator).");
            Console.WriteLine("For more information, please visit https://aka.ms/autorest");

            return 1;
        }
    }
}