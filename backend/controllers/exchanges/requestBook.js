const { getConnection } = require("../../db");
const { sendMail, generateError } = require("../../helpers");

async function requestBook(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    //Comprobar que el libro existe y está disponible
    const [currentBook] = await connection.query(
      `
        SELECT id, title, author
        FROM books
        WHERE id=? AND availability=TRUE
      `,
      [id]
    );

    if (currentBook.length === 0) {
      throw generateError(
        `El libro con id ${id} no existe o no está disponible.`,
        404
      );
    }

    //Comprobar que el libro que propone no le pertenece
    const [bookOwnerInfo] = await connection.query(
      `
        SELECT books.id, books.book_owner_id, users.id, users.name
        FROM users, books
        WHERE books.book_owner_id=users.id AND users.id=? AND books.id=?
        `,
      [req.auth.id, id]
    );

    if (bookOwnerInfo.length !== 0) {
      throw generateError(`El libro con id ${id} ya te pertenece.`, 404);
    }

    //Sacar el propietario del libro deseado
    const [wantedBookUserId] = await connection.query(
      `
        SELECT users.id
        FROM users, books
        WHERE users.id=books.book_owner_id AND books.id=?
        `,
      [id]
    );

    //Modificar exchanges
    await connection.query(
      `
          INSERT INTO exchanges(exchange_status, offered_book_user_id, wanted_book_user_id, wanted_book_id, creation_date, update_date)
          VALUES("In process", ?, ?, ?, NOW(), NOW())
        `,
      [req.auth.id, wantedBookUserId[0].id, id]
    );

    //Sacar el nombre del propietario interesado por el intercambio
    const [offeredBookUserInfo] = await connection.query(
      `
      SELECT name
      FROM users
      WHERE id=?
      `,
      [req.auth.id]
    );

    //Seleccionar el id de intercambio
    const [exchangeInfo] = await connection.query(
      `
      SELECT id
      FROM exchanges
      WHERE exchange_status='In process' AND offered_book_user_id=? AND wanted_book_user_id=? AND wanted_book_id=?
      `,
      [req.auth.id, wantedBookUserId[0].id, id]
    );

    //Enviar por mail la petición de intercambio
    const [wantedBookUserEmail] = await connection.query(
      `
        SELECT email, name
        FROM users
        WHERE id=?
      `,
      [wantedBookUserId[0].id]
    );

    let email = wantedBookUserEmail[0].email;

    try {
      await sendMail({
        email,
        title: `Intercambio de Libros | Tu libro '${currentBook[0].title}' fue sugerido para intercambiar`,
        content: `${offeredBookUserInfo[0].name} te ha solicitado intercambiar tu libro por un libro de su biblioteca. Ve para decidir sobre el intercambio a: http://localhost:8080/#/exchange/${exchangeInfo[0].id}/user/${req.auth.id}`,
      });
    } catch (error) {
      throw generateError("Error en el envío de mail.", 500);
    }

    res.send({
      status: "ok",
      message: "Se ha enviado tu petición para intercambio de libro.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = requestBook;
