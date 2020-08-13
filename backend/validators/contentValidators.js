const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

const newEntrySchema = Joi.object().keys({
  title: Joi.string()
    .max(1000)
    .required()
    .error(
      generateError(
        "El campo title debe existir y tiene como máximo 1000 caracteres.",
        400
      )
    ),
  author: Joi.string()
    .max(1000)
    .required()
    .error(
      generateError(
        "El campo author debe existir y tiene como máximo 1000 caracteres.",
        400
      )
    ),
  synopsis: Joi.string()
    .max(10000)
    .allow("")
    .error(
      generateError(
        "El campo synopsis tiene un máximo de 10000 caracteres.",
        400
      )
    ),
  authorBiography: Joi.string()
    .max(10000)
    .allow("")
    .error(
      generateError(
        "El campo authorBiography tiene un máximo de 10000 caracteres.",
        400
      )
    ),
  description: Joi.string()
    .max(10000)
    .allow("")
    .error(
      generateError(
        "El campo description tiene un máximo de 10000 caracteres.",
        400
      )
    ),
  genre: Joi.string()
    .max(10000)
    .required()
    .error(
      generateError(
        "El campo genre debe existir y tiene un máximo de 10000 caracteres.",
        400
      )
    ),
});

const editEntrySchema = Joi.object().keys({
  title: Joi.string()
    .max(1000)
    .required()
    .error(
      generateError(
        "El campo title debe existir y tiene como máximo 1000 caracteres.",
        400
      )
    ),
  author: Joi.string()
    .max(1000)
    .required()
    .error(
      generateError(
        "El campo author debe existir y tiene como máximo 1000 caracteres.",
        400
      )
    ),
  synopsis: Joi.string()
    .max(10000)
    .allow("")
    .error(
      generateError(
        "El campo synopsis tiene un máximo de 10000 caracteres.",
        400
      )
    ),
  authorBiography: Joi.string()
    .max(10000)
    .allow("")
    .error(
      generateError(
        "El campo authorBiography tiene un máximo de 10000 caracteres.",
        400
      )
    ),
  description: Joi.string()
    .max(10000)
    .allow("")
    .error(
      generateError(
        "El campo description tiene un máximo de 10000 caracteres.",
        400
      )
    ),
  genre: Joi.string()
    .max(10000)
    .required()
    .error(
      generateError(
        "El campo genre debe existir y tiene un máximo de 10000 caracteres.",
        400
      )
    ),
  image: Joi.any(),
});

module.exports = {
  newEntrySchema,
  editEntrySchema,
};
