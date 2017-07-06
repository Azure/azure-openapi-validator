module.exports = (value) => {
    let args = [];
    if(!value){
        return args;
    }
    if (value.forceEnglishOutput) {
        args = args.concat(['--force-english-output']);
    }
    if (value.source) {
        args = args.concat(['--source', value.source]);
    }
    if (value.symbolsource) {
        args = args.concat(['--symbol-source', value.symbolsource]);
    }
    if (value.timeout) {
        args = args.concat(['--timeout', value.timeout]);
    }
    if (value.apiKey) {
        args = args.concat(['--api-key', value.apiKey]);
    }
    if (value.symbolApiKey) {
        args = args.concat(['--symbol-api-key', value.symbolApiKey]);
    }
    if (value.disableBuffering) {
        args = args.concat(['--disable-buffering']);
    }
    if (value.noSymbols) {
        args = args.concat(['--no-symbols']);
    }
    return args;
};