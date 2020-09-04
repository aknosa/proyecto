const { getConnection } = require("../../db");
const { sendMail, generateError } = require("../../helpers");
const { confirmationSchema } = require("../../validators/exchangesValidators");
const { format } = require("date-fns");

async function confirmRequest(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await confirmationSchema.validateAsync(req.body);

    const { id } = req.params;
    const { offeredBookId, place, date } = req.body;

    //Comprobar que existe esa petición de intercambio
    const [currentExchange] = await connection.query(
      `
        SELECT id, offered_book_user_id, wanted_book_user_id, wanted_book_id, offered_book_id
        FROM exchanges
        WHERE id=?
      `,
      [id]
    );

    if (currentExchange.length === 0) {
      throw generateError(`El intercambio con id ${id} no existe.`, 404);
    }

    //Comprobar que el usuario que le solicitan la petición es el que puede aceptar
    if (currentExchange[0].wanted_book_user_id !== req.auth.id) {
      throw generateError(
        "No tienes permisos para aceptar esta petición de intercambio.",
        403
      );
    }

    //Comprobar que el libro que propone le pertence al usuario interesado por intercambiar
    const [offeredBookUserInfo] = await connection.query(
      `
        SELECT book_owner_id
        from books
        WHERE id=?
        `,
      [offeredBookId]
    );

    if (
      offeredBookUserInfo[0].book_owner_id !==
      currentExchange[0].offered_book_user_id
    ) {
      throw generateError(
        `El libro con id ${offeredBookId} no le pertenece al usuario con el que deseas intercambiarlo.`,
        404
      );
    }

    //Comprobar que no ha confirmado o rechazado ya
    const [existingExchange] = await connection.query(
      `
        SELECT exchange_status
        FROM exchanges
        WHERE wanted_book_user_id=? AND wanted_book_id=? AND offered_book_user_id=?
      `,
      [
        req.auth.id,
        currentExchange[0].wanted_book_id,
        currentExchange[0].offered_book_user_id,
      ]
    );

    if (
      existingExchange[0].exchange_status === "Accepted" ||
      existingExchange[0].exchange_status === "Rejected"
    ) {
      throw generateError(
        "Ya decidiste sobre esa petición de intercambio de libro.",
        403
      );
    }

    //Editar la tabla exchanges
    await connection.query(
      `
          UPDATE exchanges
          SET exchange_status="Accepted", offered_book_id=?, place=?, date=?, update_date=NOW()
          WHERE id=?
        `,
      [offeredBookId, place, date, id]
    );

    //Sacar el nombre del libro ofrecido
    const [offeredBookInfo] = await connection.query(
      `
      SELECT title
      from books
      WHERE id=?
      `,
      [offeredBookId]
    );

    //Sacar el nombre del libro deseado
    const [wantedBookInfo] = await connection.query(
      `
      SELECT title
      from books
      WHERE id=?
      `,
      [currentExchange[0].wanted_book_id]
    );

    //Sacar el nombre y el email del usuario que acepta
    const [wantedBookUserInfo] = await connection.query(
      `
      SELECT email, name
      FROM users
      WHERE id=?
      `,
      [req.auth.id]
    );

    //Enviar un correo con los datos de la recogida al solicitante del intercambio
    const [offeredBookUserEmail] = await connection.query(
      `
          SELECT users.email, users.name
          FROM users, exchanges
          WHERE exchanges.id=? AND users.id=exchanges.offered_book_user_id
        `,
      [id]
    );

    let email = offeredBookUserEmail[0].email;
    let formattedDate = format(new Date(date), "dd-MM-yyyy HH:mm");

    try {
      await sendMail({
        email,
        title:
          "Intercambio de Libros | Han aceptado tu petición de intercambio",
        content: `${wantedBookUserInfo[0].name} ha aceptado intercambiar tu libro '${offeredBookInfo[0].title}' por su libro '${wantedBookInfo[0].title}' que habías solicitado. Para veros en: ${place}, en la fecha: ${formattedDate}. Para valorar al otro usuario en cómo ha ido el intercambio, puedes visitar esta página: http://localhost:8080/#/exchange/${id}/rate-user/${req.auth.id}`,
      });
    } catch (error) {
      throw generateError("Error en el envío de mail.", 500);
    }

    //Enviar un correo al que acepta el intercambio
    try {
      await sendMail({
        email: wantedBookUserInfo[0].email,
        title:
          "Intercambio de Libros | Has aceptado la petición de intercambio",
        content: `El intercambio va tener lugar en: ${place}, en la fecha: ${formattedDate}. Para valorar al otro usuario en cómo ha ido el intercambio, puedes visitar esta página: http://localhost:8080/#/exchange/${id}/rate-user/${currentExchange[0].offered_book_user_id}`,
      });
    } catch (error) {
      throw generateError("Error en el envío de mail.", 500);
    }

    //Borrar los libros que se van a intercambiar
    await connection.query(
      `
      UPDATE  books
      SET availability=FALSE, update_date=NOW()
      WHERE id=?
      `,
      [offeredBookId]
    );

    await connection.query(
      `
      UPDATE  books
      SET availability=FALSE, update_date=NOW()
      WHERE id=?
      `,
      [currentExchange[0].wanted_book_id]
    );

    res.send({
      status: "ok",
      message: "Se ha aceptado la petición para intercambio de libro.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = confirmRequest;
