const { getConnection } = require("../../db");
const { sendMail, generateError } = require("../../helpers");

async function rejectRequest(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

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

    //Comprobar que el usuario que le solicitan la petición es el que puede rechazar
    if (currentExchange[0].wanted_book_user_id !== req.auth.id) {
      throw generateError(
        "No tienes permisos para rechazar esta petición de intercambio.",
        403
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
          SET exchange_status="Rejected", update_date=NOW()
          WHERE id=?
        `,
      [id]
    );
    //Enviar un correo diciendo que han rechazado su petición
    const [offeredBookUserEmail] = await connection.query(
      `
          SELECT users.email
          FROM users, exchanges
          WHERE exchanges.id=? AND users.id=exchanges.offered_book_user_id
        `,
      [id]
    );

    let email = offeredBookUserEmail[0].email;

    try {
      await sendMail({
        email,
        title: "Han rechazado tu petición de intercambio",
        content: `El usuario con id ${req.auth.id} no ha querido intercambiar tu libro por el libro con id ${currentExchange[0].wanted_book_id} que habías solicitado.`,
      });
    } catch (error) {
      throw generateError("Error en el envío de mail.", 500);
    }

    res.send({
      status: "ok",
      message: "Se ha rechazado la petición para intercambio de libro.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = rejectRequest;
