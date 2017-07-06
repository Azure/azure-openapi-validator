const Joi = require('joi');
class PackModel {
  /**
   * Create the validation model
   */
    constructor() {
        this.output = Joi.string().description('Directory in which to place built packages.');
        this.noBuild = Joi.boolean().description('Skip building the project prior to packing. By default, the project will be built.');
        this.includeSymbols = Joi.boolean().description('Include packages with symbols in addition to regular packages in output directory.');
        this.includeSource = Joi.boolean().description('Include PDBs and source files. Source files go into the src folder in the resulting nuget package');
        this.configuration = Joi.string().description('Configuration to use for building the project.  Default for most projects is  "Debug"');
        this.versionSuffix = Joi.string().description('Defines the value for the $(VersionSuffix) property in the project.');
        this.serviceable = Joi.boolean().description('Set the serviceable flag in the package. For more information, please see https://aka.ms/nupkgservicing');
        this.verbosity = Joi.string().only('quiet', 'minimal', 'normal', 'detailed', 'diagnostic');
        this.echo = Joi.boolean().default(false).description('Log the command to the console');
        this.msbuildArgs = Joi.array().items(Joi.string()).description('Any extra options that should be passed to MSBuild. See dotnet msbuild -h for available options');
        this.version = Joi.string().description('Sets the nuget package version');

    }

}

module.exports = PackModel;