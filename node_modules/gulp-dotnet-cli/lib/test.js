const Joi = require('joi');
const shelly = require('./shelly');
const argBuilder = require('./builders/testArgBuilder');
const TestModel = require('./models/TestModel');
const validation = Joi.object().keys(new TestModel());

module.exports = (options) => {
    let {error, value} = Joi.validate(options || {}, validation);
    if(error){
        throw error;
    }
    let calculatedArgs = argBuilder(value);
    
    return shelly('dotnet', 'test', calculatedArgs, value.echo);

};