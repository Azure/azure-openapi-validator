const Joi = require('joi');
const shelly = require('./shelly');
const argBuilder = require('./builders/restoreArgBuilder');
const RestoreModel = require('./models/RestoreModel');
const validation = Joi.object().keys(new RestoreModel());

module.exports = (options) => {
    let {error, value} = Joi.validate(options || {}, validation);
    if(error){
        throw error;
    }
    let calculatedArgs = argBuilder(value);
    
    return shelly('dotnet', 'restore', calculatedArgs, value.echo);

};