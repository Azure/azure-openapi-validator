const Joi = require('joi');
class RestoreModel {
    constructor(){
        this.source = [Joi.string().description('Specifies a NuGet package source to use during the restore.'),
            Joi.array().description('Specifies a set of NuGet package sources to use during the restore.')];
        this.runtime = Joi.string().description('Target runtime to restore packages for.');
        this.packages = Joi.string().description('Directory to install packages in.');
        this.disableParallel = Joi.boolean().description('Disables restoring multiple projects in parallel.');
        this.configfile = Joi.string().description('The NuGet configuration file to use.');
        this.noCache = Joi.boolean().description('Do not cache packages and http requests.');
        this.ignoreFailedSources = Joi.boolean().description('Treat package source failures as warnings.');
        this.noDependencies = Joi.boolean().description('Set this flag to ignore project to project references and only restore the root project');
        this.echo = Joi.boolean().default(false).description('Log the command to the console');
        this.verbosity = Joi.string().only('quiet', 'minimal', 'normal', 'detailed', 'diagnostic');
        this.msbuildArgs = Joi.array().items(Joi.string()).description('Any extra options that should be passed to MSBuild. See dotnet msbuild -h for available options');
    }
}

module.exports = RestoreModel;