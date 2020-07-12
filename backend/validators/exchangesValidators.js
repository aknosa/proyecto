const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

const confirmationSchema = Joi.object().keys({
  offeredBookId: Joi.number()
    .required()
    .integer()
    .positive()
    .error(
      generateError(
        "El campo offeredBookId debe existir y ser un número positivo entero.",
        400
      )
    ),
  place: Joi.string()
    .min(2)
    .max(100)
    .required()
    .error(
      generateError(
        "El campo place debe existir, tener un mínimo de 2 caracteres y tiene un máximo de 100 carateres.",
        400
      )
    ),
  date: Joi.date()
    .required()
    .error(
      generateError("El campo date debe existir y ser una fecha válida.", 400)
    ),
});

const userRatingSchema = Joi.object().keys({
  userRating: Joi.number()
    .required()
    .integer()
    .positive()
    .min(1)
    .max(5)
    .error(
      generateError(
        "El campo userRating es necesario y tiene que ser un número entre 1 y 5.",
        400
      )
    ),
});

module.exports = {
  confirmationSchema,
  userRatingSchema,
};
