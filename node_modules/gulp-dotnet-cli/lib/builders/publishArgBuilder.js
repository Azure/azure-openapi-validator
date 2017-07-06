module.exports = (value) => {
    let args = [];
    if(!value){
        return args;
    }
    if (value.framework) {
        args = args.concat(['--framework', value.framework]);
    }
    if (value.runtime) {
        args = args.concat(['--runtime', value.runtime]);
    }
    if (value.output) {
        args = args.concat(['--output', value.output]);
    }
    if (value.configuration) {
        args = args.concat(['--configuration', value.configuration]);
    }
    if (value.versionSuffix) {
        args = args.concat(['--version-suffix', value.versionSuffix]);
    }
    if (value.verbosity) {
        args = args.concat(['--verbosity', value.verbosity]);
    }
    if (value.msbuildArgs) {
        args = args.concat(value.msbuildArgs);
    }
    if (value.version) {
        args = args.concat(`/p:Version=${value.version}`);
    }
    return args;
};