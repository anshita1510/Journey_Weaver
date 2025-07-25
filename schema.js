const Joi= require('joi');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      url: Joi.string().required(),
      filename: Joi.string(),
    }).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});


module.exports.reviewSchema= Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(10),
        comment: Joi.string().required(),
    }).required(),
});