const Joi = require('joi');
class PublishModel {
    constructor(){
        this.framework = Joi.string().description('Target framework to publish for. The target framework has to be specified in the project file.');
        this.runtime = Joi.string().description('Publish the project for a given runtime. This is used when creating self-contained deployment. Default is to publish a framework-dependented app');
        this.output = Joi.string().description('Output directory in which to place the published artifacts.');
        this.configuration = Joi.string().description('Configuration to use for building the project. Default for most projects is  "Debug"');
        this.versionSuffix = Joi.string().description('Defines the value for the $(VersionSuffix) property in the project');
        this.version = Joi.string().description('Sets the $(Version) property in msbuild');
        this.echo = Joi.boolean().default(false).description('Log the command to the console');
        this.verbosity = Joi.string().only('quiet', 'minimal', 'normal', 'detailed', 'diagnostic');
        this.msbuildArgs = Joi.array().items(Joi.string()).description('Any extra options that should be passed to MSBuild. See dotnet msbuild -h for available options');
    }
}

module.exports = PublishModel;