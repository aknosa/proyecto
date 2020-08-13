const { getConnection } = require("../../db");

async function getUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT id, registration_date, email, role, name, image, location, phone_number, birthdate
      FROM users
      WHERE id=?
    `,
      [id]
    );

    if (result.length === 0) {
      const error = new Error(`El usuario con id ${id} no existe.`);
      error.httpStatus = 404;
      throw error;
    }

    const [booksResult] = await connection.query(
      `
      SELECT title,author,image,id,genre,synopsis,author_biography,description 
      FROM book_exchange.books
      WHERE book_owner_id=?
      `,
      [id]
    );

    const [offeredBookUserRating] = await connection.query(
      `
      SELECT AVG(offered_book_user_rating) AS user_rating_offered
      FROM exchanges
      WHERE offered_book_user_id=?`,
      [id]
    );

    const [wantedBookUserRating] = await connection.query(
      `
      SELECT AVG(wanted_book_user_rating) AS user_rating_wanted
      FROM exchanges
      WHERE wanted_book_user_id=?`,
      [id]
    );

    let userRating;

    if (offeredBookUserRating && wantedBookUserRating) {
      userRating =
        (offeredBookUserRating[0].user_rating_offered +
          wantedBookUserRating[0].user_rating_wanted) /
        2;
    } else if (offeredBookUserRating && !wantedBookUserRating) {
      userRating = offeredBookUserRating;
    } else if (!offeredBookUserRating && wantedBookUserRating) {
      userRating = wantedBookUserRating;
    } else {
      userRating = null;
    }

    const [userData] = result;

    const responseData = {
      registrationDate: userData.registrationDate,
      name: userData.name,
      image: userData.image,
      userRating: userRating.toFixed(1),
      location: userData.location,
      books: booksResult,
    };

    if (userData.id === req.auth.id || req.auth.role === "admin") {
      responseData.email = userData.email;
      responseData.role = userData.role;
      responseData.birthdate = userData.birthdate;
      responseData.phoneNumber = userData.phone_number;
    }

    res.send({
      status: "ok",
      data: responseData,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getUser;
