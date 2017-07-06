module.exports = (value) => {
    let args = [];
    if(!value){
        return args;
    }
    if (value.settings) {
        args = args.concat(['--settings', value.settings]);
    }
    if (value.listTests) {
        args = args.concat(['--list-tests']);
    }
    if (value.testAdapterPath) {
        args = args.concat(['--test-adapter-path', value.testAdapterPath]);
    }
    if (value.logger) {
        args = args.concat(['--logger', value.logger]);
    }
    if (value.configuration) {
        args = args.concat(['--configuration', value.configuration]);
    }
    if (value.framework) {
        args = args.concat(['--framework', value.framework]);
    }
    if (value.output) {
        args = args.concat(['--output', value.output]);
    }
    if (value.diag) {
        args = args.concat(['--diag', value.diag]);
    }
    if (value.noBuild) {
        args = args.concat(['--no-build']);
    }
    if (value.verbosity) {
        args = args.concat(['--verbosity', value.verbosity]);
    }
    if (value.additionalArgs) {
        args = args.concat(value.additionalArgs);
    }
    return args;
};