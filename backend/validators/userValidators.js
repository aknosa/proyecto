const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

const loginUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(
      generateError("El campo email debe existir y ser un email válido.", 400)
    ),
  password: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        "El campo password debe existir y ser mayor de 8 caracteres.",
        400
      )
    ),
});

const newUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(
      generateError("El campo email debe existir y ser un email válido.", 400)
    ),
  password: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        "El campo password debe existir y ser mayor de 8 caracteres.",
        400
      )
    ),
  location: Joi.string()
    .max(100)
    .required()
    .error(
      generateError(
        "El campo location debe existir no debe tener más de 100 caracteres.",
        400
      )
    ),
  name: Joi.string()
    .max(100)
    .required()
    .error(
      generateError(
        "El campo name debe existir y no debe de tener más de 100 caracteres.",
        400
      )
    ),
});

const editUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(
      generateError(
        "El campo email debe existir y contener un email válido.",
        400
      )
    ),
  name: Joi.string()
    .max(100)
    .required()
    .error(
      generateError(
        "El campo name debe existir y no debe de tener más de 100 caracteres.",
        400
      )
    ),
  birthdate: Joi.date().error(
    generateError("El campo date debe ser una fecha válida.", 400)
  ),
  phoneNumber: Joi.number()
    .allow("")
    .integer()
    .positive()
    .error(generateError("El número de teléfono no es válido.", 400)),
  location: Joi.string()
    .max(100)
    .required()
    .error(
      generateError(
        "El campo location no debe tener más de 100 caracteres.",
        400
      )
    ),
  avatar: Joi.any(),
});

const editUserPasswordSchema = Joi.object().keys({
  oldPassword: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        "El campo oldPassword debe existir y ser mayor de 8 caracteres.",
        400
      )
    ),
  newPassword: Joi.string()
    .min(8)
    .required()
    .invalid(Joi.ref("oldPassword"))
    .error(
      generateError(
        "El campo newPassword debe existir, ser diferente a oldPassword y ser mayor de 8 caracteres.",
        400
      )
    ),
});

const recoverUserPasswordSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(generateError("El campo email debe contener un email válido.", 400)),
});

const resetUserPasswordSchema = Joi.object().keys({
  recoverCode: Joi.string()
    .length(40)
    .required()
    .error(
      generateError(
        "El campo recoverCode debe existir y tener 40 caracteres.",
        400
      )
    ),
  newPassword: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        "El campo newPassword debe existir, y ser mayor de 8 caracteres.",
        400
      )
    ),
});

module.exports = {
  newUserSchema,
  loginUserSchema,
  editUserSchema,
  editUserPasswordSchema,
  recoverUserPasswordSchema,
  resetUserPasswordSchema,
};
