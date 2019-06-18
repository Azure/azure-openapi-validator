// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using OpenAPI.Validator.Validation.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using AutoRest.Core.Logging;
using OpenAPI.Validator.Properties;
using OpenAPI.Validator.Model;

namespace OpenAPI.Validator.Validation
{
  /// <summary>
  /// Validates the version of the swagger. API version must follow the date pattern
  /// yyyy-MM-dd and allowed prefixes are -preview, -alpha, -beta, -rc, -privatepreview.
  /// </summary>
  public class PathsMustNotBeEmpty : TypedRule<Dictionary<string, Dictionary<string, Operation>>>
  {
    /// <summary>
    /// Id of the Rule.
    /// </summary>
    public override string Id => "R4012";

    /// <summary>
    /// Violation category of the Rule.
    /// </summary>
    public override ValidationCategory ValidationCategory => ValidationCategory.SDKViolation;

    /// <summary>
    /// The template message for this Rule. 
    /// </summary>
    /// <remarks>
    /// This may contain placeholders '{0}' for parameterized messages.
    /// </remarks>
    public override string MessageTemplate => Resources.PathsMustNotBeEmpty;

    /// <summary>
    /// The severity of this message (ie, debug/info/warning/error/fatal, etc)
    /// </summary>
    public override Category Severity => Category.Error;

    /// <summary>
    /// What kind of open api document type this rule should be applied to
    /// </summary>
    public override ServiceDefinitionDocumentType ServiceDefinitionDocumentType => ServiceDefinitionDocumentType.Default;

    /// <summary>
    /// What state of the document to run the validation rule on
    /// </summary>
    public override ServiceDefinitionDocumentState ValidationRuleMergeState => ServiceDefinitionDocumentState.Individual;


    public override IEnumerable<ValidationMessage> GetValidationMessages(Dictionary<string, Dictionary<string, Operation>> paths, RuleContext context)
    {
      if (paths.Count == 0)
      {
        yield return new ValidationMessage(new FileObjectPath(context.File, context.Parent.Path.AppendProperty("paths")), this);
      }
    }

  }


}
