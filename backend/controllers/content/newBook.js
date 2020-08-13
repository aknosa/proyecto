const { getConnection } = require("../../db");
const { processAndSaveImage, generateError } = require("../../helpers");

const { newEntrySchema } = require("../../validators/contentValidators");

async function newBook(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    await newEntrySchema.validateAsync(req.body);

    // Sacar de req.body los datos que necesitio
    const {
      author,
      title,
      genre,
      synopsis,
      authorBiography,
      description,
    } = req.body;

    let savedImageFileName;

    // Procesar la imagen si está en el body
    if (req.files && req.files.image) {
      try {
        // Procesar y guardar imagen
        savedImageFileName = await processAndSaveImage(req.files.image);
      } catch (error) {
        throw generateError(
          "No se pudo procesar la imagen. Inténtalo de nuevo.",
          400
        );
      }
    }

    // Ejecutar la query
    const [result] = await connection.query(
      `
      INSERT INTO books(creation_date, availability, author, title, genre, image, synopsis, author_biography, description, update_date, book_owner_id)
      VALUES(NOW(), TRUE, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `,
      [
        author,
        title,
        genre,
        savedImageFileName,
        synopsis,
        authorBiography,
        description,
        req.auth.id,
      ]
    );

    // Devolver el resultado

    res.send({
      status: "ok",
      data: {
        id: result.insertId,
        author,
        title,
        genre,
        image: savedImageFileName,
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

module.exports = newBook;
