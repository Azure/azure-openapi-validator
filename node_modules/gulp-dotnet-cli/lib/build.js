const Joi = require('joi');
const shelly = require('./shelly');
const argBuilder = require('./builders/buildArgBuilder');
const BuildModel = require('./models/BuildModel');
const validation = Joi.object().keys(new BuildModel());

module.exports = (options) => {
    let {error, value} = Joi.validate(options || {}, validation);
    if(error){
        throw error;
    }
    let calculatedArgs = argBuilder(value);
    
    return shelly('dotnet', 'build', calculatedArgs, value.echo);

};