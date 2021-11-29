const Joi = require('joi')

module.exports.characterSchema = Joi.object({
  name: Joi.string().min(2).lowercase().required(),
  age: Joi.number().min(1).required(),
  weight: Joi.number().required(),
  history: Joi.string().lowercase().min(2).required()
})

module.exports.putCharacterSchema = Joi.object({
  name: Joi.string().min(2).lowercase(),
  age: Joi.number().min(1),
  weight: Joi.number(),
  history: Joi.string().lowercase().min(2)
})

module.exports.putMovieSchema = Joi.object({
  title: Joi.string().min(2).lowercase(),
  creationDate: Joi.date(),
  score: Joi.number().min(1).max(5).integer()
})
module.exports.movieSchema = Joi.object({
  title: Joi.string().min(2).lowercase().required(),
  creationDate: Joi.date().required(),
  score: Joi.number().min(1).max(5).integer().required()
})

module.exports.movieCharacterSchema = Joi.object({
  movieId: Joi.number().required(),
  actorId: Joi.number().required()
})

module.exports.registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(4).required()
})

module.exports.loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(4).required()
})
