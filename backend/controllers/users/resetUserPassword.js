const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

const { resetUserPasswordSchema } = require("../../validators/userValidators");

async function resetUserPassword(req, res, next) {
  let connection;

  try {
    await resetUserPasswordSchema.validateAsync(req.body);

    connection = await getConnection();

    const { recoverCode, newPassword } = req.body;

    // Comprobar que existe un usuario con el código de recover en la base de datos
    const [current] = await connection.query(
      `
      SELECT id
      FROM users
      WHERE password_update_code=?
    `,
      [recoverCode]
    );

    if (current.length === 0) {
      throw generateError(
        "No hay ningún usuario con este código de recuperación de password.",
        404
      );
    }

    // Actualizar password
    await connection.query(
      `
      UPDATE users
      SET password=SHA2(?, 512), password_update_code=NULL, update_date=NOW(), last_auth_update=NOW()
      WHERE password_update_code=?
    `,
      [newPassword, recoverCode]
    );

    res.send({
      status: "ok",
      message: "Password actualizada.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = resetUserPassword;
