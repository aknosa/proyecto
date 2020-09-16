const { getConnection } = require("../../db");
const { randomString, sendMail, generateError } = require("../../helpers");

const { newUserSchema } = require("../../validators/userValidators");

async function newUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await newUserSchema.validateAsync(req.body);

    const { email, password, location, name } = req.body;

    // Comprobar que no existe un usuario con ese mismo email en la base de datos
    const [existingUser] = await connection.query(
      `
      SELECT id 
      FROM users
      WHERE email=?
    `,
      [email]
    );

    if (existingUser.length > 0) {
      throw generateError(
        "Ya existe un usuario en la base de datos con ese email.",
        409
      );
    }

    // enviar un mensaje de confirmación de registro al email indicado
    // ejemplo url validación:
    // http://localhost:3000/users/validate/454e5109e4f3245c63be6fddb9ab05e4296ad1c6

    const registrationCode = randomString(40);
    const validationURL = `${process.env.FRONTEND_URL}/validate/${registrationCode}`;

    //Enviamos la url anterior por mail
    try {
      await sendMail({
        email,
        title: "Intercambio de Libros | Valida tu cuenta de usuario",
        content: `Para validar tu cuenta de usuario en Intercambio de Libros, haz click aquí: ${validationURL}`,
      });
    } catch (error) {
      throw generateError("Error en el envío de mail.", 500);
    }

    // Meter el nuevo usuario en la base de datos sin activar
    await connection.query(
      `
      INSERT INTO users(registration_date, email, password, registration_code, update_date, creation_date, name, location, image)
      VALUES(NOW(), ?, SHA2(?, 512), ?, NOW(), NOW(), ?, ?, "usuario1.jpg")
    `,
      [email, password, registrationCode, name, location]
    );

    res.send({
      status: "ok",
      message:
        "Usuario registrado. Mira tu email para activarlo. Mira en la carpeta de SPAM si no lo encuentras.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newUser;
