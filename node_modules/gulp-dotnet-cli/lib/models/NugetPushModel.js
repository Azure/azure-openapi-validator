const Joi = require('joi');
/* Represents a build model */
class NugetPushModel {
  /**
   * Create the validation model
   */
    constructor() {

        this.forceEnglishOutput = Joi.boolean().description(' Forces the application to run using an invariant, English-based culture.');
        this.source = Joi.string().description('Specifies the server URL');
        this.symbolsource = Joi.string().description('Specifies the symbol server URL. If not specified, nuget.smbsrc.net is used when pushing to nuget.org');
        this.timeout = Joi.number().integer().description('Specifies the timeout for pushing to a server in seconds. Defaults to 300 seconds (5 minutes)');
        this.apiKey = Joi.string().description('The API key for the server.');
        this.symbolApiKey = Joi.string().description('The API key for the symbol server.');
        this.disableBuffering = Joi.boolean().description('Disable buffering when pushing to an HTTP(S) server to decrease memory usage.');
        this.noSymbols = Joi.boolean().description('If a symbols package exists, it will not be pushed to a symbols server.');
        this.echo = Joi.boolean().default(false).description('Log the command to the console');
    }

}

module.exports = NugetPushModel;