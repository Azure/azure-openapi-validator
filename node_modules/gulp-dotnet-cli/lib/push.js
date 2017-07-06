const Joi = require('joi');
const shelly = require('./shelly');
const argBuilder = require('./builders/nugetPushArgBuilder');
const NugetPushModel = require('./models/NugetPushModel');
const validation = Joi.object().keys(new NugetPushModel());

module.exports = (options) => {
    let {error, value} = Joi.validate(options || {}, validation);
    if(error){
        throw error;
    }
    let calculatedArgs = argBuilder(value);
    
    return shelly('dotnet', ['nuget', 'push'], calculatedArgs, value.echo);

};