let _ = require('lodash');

module.exports = (value) => {
    let args = [];
    if(!value){
        return args;
    }
    if (value.source) {
        args = args.concat(_.isArray(value.source) 
            ? _.chain(value.source).map((source) => ['--source', source]).flatten().value()
            : ['--source', value.source]);
    }
    if (value.runtime) {
        args = args.concat(['--runtime', value.runtime]);
    }
    if (value.packages) {
        args = args.concat(['--packages', value.packages]);
    }
    if (value.disableParallel) {
        args = args.concat(['--disable-parallel']);
    }
    if (value.configfile) {
        args = args.concat(['--configfile', value.configfile]);
    }
    if (value.noIncremental) {
        args = args.concat(['--no-incremental']);
    }
    if (value.noDepenencies) {
        args = args.concat(['--no-dependencies']);
    }
    if (value.verbosity) {
        args = args.concat(['--verbosity', value.verbosity]);
    }
    if (value.msbuildArgs) {
        args = args.concat(value.msbuildArgs);
    }
    return args;
};