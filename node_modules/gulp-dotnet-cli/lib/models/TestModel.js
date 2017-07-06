const Joi = require('joi');
/* Represents a test schema model */
class TestModel {
  /**
   * Create the validation model
   */
    constructor() {
        this.settings = Joi.string().description('Settings to use when running tests.');
        this.listTests = Joi.boolean().description('Lists discovered tests');
        this.filter = Joi.string().description('Run tests that match the given expression');
        this.testAdapterPath = Joi.string().description('Use custom adapters from the given path in the test run.');
        this.logger = Joi.string().description('Specify a logger for test results.');
        this.configuration = Joi.string().description('Configuration to use for building the project. Default for most projects is  "Debug"');
        this.framework = Joi.string().description('Looks for test binaries for a specific framework');
        this.output = Joi.string().description('Directory in which to find the binaries to be run');
        this.diag = Joi.string().description('Enable verbose logs for test platform. Logs are written to the provided file.');
        this.noBuild = Joi.boolean().description('Do not build project before testing.');
        this.echo = Joi.boolean().default(false).description('Log the command to the console');
        this.verbosity = Joi.string().only('quiet', 'minimal', 'normal', 'detailed', 'diagnostic');
        this.additionalArgs = Joi.array().items(Joi.string()).description('Any extra commandline runsettings arguments that should be passed to vstest. See dotnet vstest --help for available options');
    }

}

module.exports = TestModel;