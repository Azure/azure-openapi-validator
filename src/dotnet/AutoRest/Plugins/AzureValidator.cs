// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using AutoRest.Core.Logging;
using Microsoft.Perks.JsonRPC;
using AutoRest.Core.Utilities;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;
using OpenAPI.Validator;
using OpenAPI.Validator.Validation.Core;
using System.Threading.Tasks;
using System;
using OpenAPI.Validator.Model;

public class AzureValidator : NewPlugin
{
    public AzureValidator(Connection connection, string sessionId) : base(connection, sessionId)
    { }

    private readonly Regex resPathPattern = new Regex(@"/providers/(?<providerNamespace>[^{/]+)/((?<resourceType>[^{/]+)/)?");

    private void LogValidationMessage(ValidationMessage validationMessage)
    {
        string path = validationMessage.Path.ObjectPath.Path
            .OfType<ObjectPathPartProperty>()
            .Select(p => p.Property)
            .SkipWhile(p => p != "paths")
            .Skip(1)
            .FirstOrDefault();
        var pathComponents = resPathPattern.Match(path ?? "");
        var pathComponentProviderNamespace = pathComponents.Groups["providerNamespace"];
        var pathComponentResourceType = pathComponents.Groups["resourceType"];

        // create the raw message
        var rawMessageDetails = new Dictionary<string, string>() {
            { "type", validationMessage.Severity.ToString() },
            { "code", validationMessage.Rule.GetType().Name },
            { "message", validationMessage.Message },
            { "id", validationMessage.Rule.Id },
            { "validationCategory", validationMessage.Rule.ValidationCategory.ToString() },
            { "providerNamespace", pathComponentProviderNamespace.Success ? pathComponentProviderNamespace.Value : null },
            { "resourceType", pathComponentResourceType.Success ? pathComponentResourceType.Value : null }
        };

        // post it to the pipe
        Message(new Message
        {
            Text = validationMessage.Message,
            Channel = validationMessage.Severity.ToString().ToLowerInvariant(),
            Details = rawMessageDetails,
            Key = new string[]
            {
                validationMessage.Rule.GetType().Name,
                validationMessage.Rule.Id,
                validationMessage.Rule.ValidationCategory.ToString()
            },
            Source = new[]
            {
                new SourceLocation
                {
                    document = validationMessage.Path.FilePath.ToString(),
                    Position = new SmartPosition
                    {
                        path = validationMessage.Path.ObjectPath.Path.Select(x => x.RawPath).ToArray()
                    }
                }
            }
        });
    }

    protected override async Task<bool> ProcessInternal()
    {
        var docStateInput = await GetValue<string>("merge-state");
        ServiceDefinitionDocumentState docState;
        if (!Enum.TryParse<ServiceDefinitionDocumentState>(docStateInput, true, out docState))
        {
            throw new Exception("Invalid Input for merge-state: " + docStateInput + ". Valid values are 'individual' and 'composed'.");
        }

        if (await GetValue<bool>("azure-validator.debugger"))
        {
            Debugger.Await();
        }
        switch (docState)
        {
            case ServiceDefinitionDocumentState.Composed:
                if (await GetValue<bool>("azure-validator.composed-debugger"))
                {
                    Debugger.Await();
                }
                break;
            case ServiceDefinitionDocumentState.Individual:
                if (await GetValue<bool>("azure-validator.individual-debugger"))
                {
                    Debugger.Await();
                }
                break;
        }

        var files = await ListInputs();
        foreach (var file in files)
        {
            var content = await ReadFile(file);
            var fs = new MemoryFileSystem();
            fs.WriteAllText(file, content);

            var serviceDefinition = SwaggerParser.Load(file, fs);
            var validator = new RecursiveObjectValidator(PropertyNameResolver.JsonName);
            var docTypeInput = (await GetValue<string>("openapi-type"));

            ServiceDefinitionDocumentType docType;
            // Convert data-plane to dataplane
            if (!Enum.TryParse<ServiceDefinitionDocumentType>(docTypeInput.Replace("-", ""), true, out docType))
            {
                throw new Exception("Invalid Input for openapi-type: " + docTypeInput + ". Valid values are 'arm', 'data-plane' or 'default'.");
            }

            var metadata = new ServiceDefinitionMetadata
            {
                ServiceDefinitionDocumentType = docType,
                MergeState = docState
            };

            foreach (ValidationMessage validationEx in validator.GetValidationExceptions(new Uri(file, UriKind.RelativeOrAbsolute), serviceDefinition, metadata))
            {
                LogValidationMessage(validationEx);
            }
        }
        return true;
    }
}