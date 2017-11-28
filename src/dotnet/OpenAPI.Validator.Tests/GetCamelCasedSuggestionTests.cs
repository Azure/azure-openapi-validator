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
        [InlineData("URI", "uri")]
        [InlineData("SomeURIThing", "someUriThing")]
        [InlineData("IP", "ip")]
        [InlineData("IPAddress", "ipAddress")]
        [InlineData("VEryInteresting", "vEryInteresting")]
        [InlineData("LotsOfVirtualMachines", "lotsOfVirtualMachines")]
        [InlineData("LotsOfVMs", "lotsOfVMs")]
        [InlineData("ManyThingS", "manyThings")]
        [InlineData("elegantVM", "elegantVm")]
        public void CorrectlyCasesExamples(string input, string expectedOutput)
        {
            Assert.Equal(expectedOutput, ValidationUtilities.GetCamelCasedSuggestion(input));
        }
    }
}
