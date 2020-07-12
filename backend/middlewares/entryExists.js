const { getConnection } = require("../db");
const { generateError } = require("../helpers");

async function entryExists(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;

    // Comprobar que la entrada que queremos editar exista en la base de datos
    const [current] = await connection.query(
      `
      SELECT id
      FROM books
      WHERE id=? AND availability=TRUE
    `,
      [id]
    );

    if (current.length === 0) {
      throw generateError(
        `El libro con id ${id} no existe en la base de datos o no está disponible.`,
        404
      );
    } else {
      next();
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = entryExists;
