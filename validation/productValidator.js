const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

exports.newProduct = (product)=>{
    const schema = joi.object({
        name: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
        price:joi.string().required(), 
        quantity:joi.number(), 
        images: joi.array().items(joi.string()),
        colors:joi.array().items(joi.string()),
        category: joi.objectId(),
        ratingsAverage:joi.number().min(1).max(5),
        ratingsQuantity:joi.number()
        
    });

    return schema.validate(product);
}

exports.updateProduct = (product)=>{
    const schema = joi.object({
        name: joi.string().min(3).max(30),
        description: joi.string(),
        price:joi.number(),
        images: joi.array().items(joi.string()),
        quantity:joi.number(), 
        colors:joi.array().items(joi.string()),
        category:joi.objectId(),
        ratingsAverage:joi.number().min(1).max(5),
        ratingsQuantity:joi.number()
    });
    return schema.validate(product);
}