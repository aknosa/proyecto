const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

const { userRatingSchema } = require("../../validators/exchangesValidators");

async function rejectRequest(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await userRatingSchema.validateAsync(req.body);

    const { id } = req.params;
    const { userRating } = req.body;

    //Comprobar que el intercambio existe
    const [currentExchange] = await connection.query(
      `
          SELECT id, offered_book_user_id, wanted_book_user_id, exchange_status, offered_book_id, wanted_book_id, offered_book_user_rating, wanted_book_user_rating
          FROM exchanges
          WHERE id=?
        `,
      [id]
    );

    if (currentExchange.length === 0) {
      throw generateError(`El intercambio con id ${id} no existe.`, 404);
    }

    //Comprobar que el usuario que puntúa participó en el intercambio
    if (
      currentExchange[0].offered_book_user_id !== req.auth.id &&
      currentExchange[0].wanted_book_user_id !== req.auth.id
    ) {
      throw generateError(
        "No puedes puntuar un usuario de un intercambio que no participaste.",
        403
      );
    }

    //Comprobar que el intercambio está hecho
    if (currentExchange[0].exchange_status !== "Accepted") {
      throw generateError(
        "El intercambio todavía está en proceso o ha sido rechazado, por lo que no puedes puntuar al usuario.",
        403
      );
    }

    //Comprobar que el usuario solo vota una vez y modificar tabla exchanges
    if (
      currentExchange[0].offered_book_user_id === req.auth.id &&
      !currentExchange[0].wanted_book_user_rating
    ) {
      await connection.query(
        `
            UPDATE exchanges
            SET wanted_book_user_rating=?, update_date=NOW()
            WHERE id=?`,
        [userRating, id]
      );
    } else if (
      currentExchange[0].wanted_book_user_id === req.auth.id &&
      !currentExchange[0].offered_book_user_rating
    ) {
      await connection.query(
        `
                UPDATE exchanges
                SET offered_book_user_rating=?, update_date=NOW()
                WHERE id=?`,
        [userRating, id]
      );
    } else {
      throw generateError("Ya has valorado a ese usuario.", 401);
    }
    res.send({
      status: "ok",
      message: `Has valorado al otro usuario con una puntuación de ${userRating} sobre 5.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = rejectRequest;
