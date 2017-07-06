const Joi = require('joi');
const shelly = require('./shelly');
const argBuilder = require('./builders/packArgBuilder');
const PackModel = require('./models/PackModel');
const validation = Joi.object().keys(new PackModel());

module.exports = (options) => {
    let {error, value} = Joi.validate(options || {}, validation);
    if(error){
        throw error;
    }
    let calculatedArgs = argBuilder(value);
    
    return shelly('dotnet', 'pack', calculatedArgs, value.echo);

};