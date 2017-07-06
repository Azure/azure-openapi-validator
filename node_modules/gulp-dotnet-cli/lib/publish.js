const Joi = require('joi');
const shelly = require('./shelly');
const argBuilder = require('./builders/publishArgBuilder');
const PublishModel = require('./models/PublishModel');
const validation = Joi.object().keys(new PublishModel());

module.exports = (options) => {
    let {error, value} = Joi.validate(options || {}, validation);
    if(error){
        throw error;
    }
    let calculatedArgs = argBuilder(value);
    
    return shelly('dotnet', 'publish', calculatedArgs, value.echo);

};