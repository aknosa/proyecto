const { getConnection } = require("../../db");

async function getBook(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT books.title, books.author, books.synopsis, books.author_biography, books.description, books.image, books.book_owner_id, books.availability, users.location AS book_owner_location 
      FROM books, users
      WHERE books.id=? AND books.book_owner_id=users.id AND availability=TRUE;
    `,
      [id]
    );

    res.send({
      status: "ok",
      data: result[0],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBook;
