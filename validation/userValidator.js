const joi = require('joi');

exports.newUser = (user)=>{
    const schema = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        password:joi.string().min(8).required(), 
        passwordConfirm:joi.string().valid(joi.ref('password')).required(), 
        role:joi.string(),
        
    });

    return schema.validate(user);
}

exports.updateUser = (user)=>{
    const schema = joi.object({
        name: joi.string().min(3).max(30),
        email: joi.string(), 
        photo:joi.string(),
        password:joi.string().min(8) , 
        passwordConfirm:joi.string().valid(joi.ref('password')), 
        role:joi.string() 
         
    });
    return schema.validate(user);
}