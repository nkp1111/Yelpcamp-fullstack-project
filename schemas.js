const Joi = require("joi")

const campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  // image: Joi.string().required(),
  description: Joi.string().required(),
})

const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  body: Joi.string().required()
})

module.exports = {
  campgroundSchema,
  reviewSchema,
}