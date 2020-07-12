const { getConnection } = require("../../db");
const { deleteUpload, generateError } = require("../../helpers");

async function deleteEntry(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { id } = req.params;

    // Comprobar que existe esa id y si no dar error404
    const [current] = await connection.query(
      `
      SELECT book_owner_id, image, availability
      FROM books
      WHERE id=?
    `,
      [id]
    );

    if (current[0].book_owner_id !== req.auth.id && req.auth.role !== "admin") {
      throw generateError("No tienes permisos para borrar este libro.", 403);
    }

    // Si la entrada tiene imagen asociada borrarla
    if (current[0].image) {
      await deleteUpload(current[0].image);
    }

    // Borrar la entrada de la tabla
    await connection.query(
      `
      DELETE FROM books
      WHERE id=?
    `,
      [id]
    );

    res.send({
      status: "ok",
      message: `El libro con ${id} de la tabla books fue borrada.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteEntry;
