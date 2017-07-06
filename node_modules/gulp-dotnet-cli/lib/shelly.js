let through = require('through2');
let gutil = require('gulp-util');
let PluginError = gutil.PluginError;
let cp = require('child-process-promise');
let _ = require('lodash');
// Consts
const PLUGIN_NAME = 'gulp-dotnet-cli';


// Plugin level function(dealing with files)
/*
 * Wrapper over through2 to execute commands with promises
 * @param {string} command the root command to run usually dotnet
 * @param {string|Array<string>} noun The action to take build, push, pack, etc
 * @param {Array<String>} args the arguments to pass such as ['--verbosity', 'normal'] 
 * @param {boolean} echo Should the command be printed to the console?
*/
function shelly(command, noun, args, echo) {
    if (!_.isArray(args)) {
        throw new PluginError(PLUGIN_NAME, 'Arguments has to be an array');
    }
    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, cb) {
        if (!file.path) {
            // return empty file
            return cb(null, file);
        }
        let calculatedArgs = _.concat([], noun, file.path, args);
        if(echo){
            console.log(`${command} ${calculatedArgs.join(' ')}`);
        }
        cp.spawn(command, calculatedArgs, { stdio: 'inherit' })
                .then(a=>cb(null, file))
                .catch(ex => cb(ex, file));

    });

}

// Exporting the plugin main function
module.exports = shelly;