const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);


exports.newReview = (review)=>{
    const schema = joi.object({          
          comment: joi.string().required(),
          product: joi.required(),
          user: joi.required()
                
    });

    return schema.validate(review);
}

exports.newRating = (review)=>{
    const schema = joi.object({
         rating:  joi.number().min(1).max(5).required(),
         product: joi.required(),
         user: joi.required()
        
    });
    return schema.validate(review);
}