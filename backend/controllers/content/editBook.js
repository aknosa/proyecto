const { getConnection } = require("../../db");
const {
  processAndSaveImage,
  deleteUpload,
  generateError,
} = require("../../helpers");

const { editEntrySchema } = require("../../validators/contentValidators");

async function editBook(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await editEntrySchema.validateAsync(req.body);

    // Sacamos los datos
    const { author, title, synopsis, authorBiography, description } = req.body;
    const { id } = req.params;

    // Seleccionar datos actuales de la entrada
    const [current] = await connection.query(
      `
    SELECT id, author, title, synopsis, author_biography, description, image, book_owner_id
    FROM books
    WHERE id=?
  `,
      [id]
    );

    const [currentEntry] = current;

    if (
      currentEntry.book_owner_id !== req.auth.id &&
      req.auth.role !== "admin"
    ) {
      throw generateError("No tienes permisos para editar esta entrada.", 403);
    }

    let savedImageFileName;

    // Procesar la imagen si existe
    if (req.files && req.files.image) {
      try {
        // Procesar y guardar imagen
        savedImageFileName = await processAndSaveImage(req.files.image);

        if (currentEntry.image) await deleteUpload(currentEntry.image);
      } catch (error) {
        throw generateError(
          "No se pudo procesar la imagen. Inténtalo de nuevo.",
          400
        );
      }
    } else {
      savedImageFileName = currentEntry.image;
    }

    // Ejecutar la query de edición de la entrada
    await connection.query(
      `
      UPDATE books 
      SET author=?, title=?, synopsis=?, author_biography=?, description=?, image=?, update_date=NOW()
      WHERE id=?
    `,
      [
        author,
        title,
        synopsis,
        authorBiography,
        description,
        savedImageFileName,
        id,
      ]
    );

    // Devolver resultados
    res.send({
      status: "ok",
      data: {
        author,
        title,
        synopsis,
        authorBiography,
        description,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editBook;
