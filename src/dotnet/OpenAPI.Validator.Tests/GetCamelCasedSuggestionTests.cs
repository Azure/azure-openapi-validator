using System;
using System.Collections.Generic;
using System.Text;
using OpenAPI.Validator.Model.Utilities;
using Xunit;

namespace OpenAPI.Validator.Tests
{
    public class GetCamelCasedSuggestionTests
    {
        [Theory]
        [InlineData("URI", "Uri")]
        [InlineData("SomeURIThing", "SomeUriThing")]
        [InlineData("IP", "Ip")]
        [InlineData("IPAddress", "IpAddress")]
        public void CorrectlyCasesExamples(string input, string expectedOutput)
        {
            Assert.Equal(expectedOutput, ValidationUtilities.GetCamelCasedSuggestion(input));
        }
    }
}
