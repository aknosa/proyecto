const { getConnection } = require("../../db");

async function listBooks(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    // Sacamos las posibles opciones del querystring:
    //  search: para listar solo las entradas que contengan su valor en place o description
    //  order: para ordernar el listado por voteAverage, place o date
    //  direction: para la dirección de la ordenación desc o asc
    const { search, order, /*direction,*/ field } = req.query;

    // Proceso la dirección de orden
    const orderDirection = "DESC";
    //(direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";

    // Proceso el campo de orden
    let orderBy;
    switch (order) {
      case "author":
        orderBy = "author";
        break;
      case "title":
        orderBy = "title";
        break;
      case "location":
        orderBy = "location";
        break;
      case "genre":
        orderBy = "genre";
        break;
      default:
        orderBy = "creation_date";
    }

    // Ejecuto la query en base a si existe querystring de search o no
    let queryResults;
    if (search) {
      if (search && field === "Autor") {
        queryResults = await connection.query(
          `
          SELECT books.id, books.creation_date, books.title, books.author, books.genre, books.synopsis, books.description, books.author_biography, books.book_owner_id, books.availability, users.location, users.name, books.image
          FROM books, users
          WHERE (books.author LIKE ?) AND (books.book_owner_id=users.id) AND books.availability=TRUE
          ORDER BY ${orderBy} ${orderDirection}
          `,
          [`%${search}%`]
        );
      } else if (search && field === "Título") {
        queryResults = await connection.query(
          `
          SELECT books.id, books.creation_date, books.title, books.author, books.genre, books.synopsis, books.description, books.author_biography, books.book_owner_id, books.availability, users.location, users.name, books.image
          FROM books, users
          WHERE (books.title LIKE ?) AND (books.book_owner_id=users.id) AND books.availability=TRUE
          ORDER BY ${orderBy} ${orderDirection}
          `,
          [`%${search}%`]
        );
      } else if (search && field === "Localidad") {
        queryResults = await connection.query(
          `
        SELECT books.id, books.creation_date, books.title, books.author, books.genre, books.synopsis, books.description, books.author_biography, books.book_owner_id, books.availability, users.location, users.name, books.image
        FROM books, users
        WHERE (users.location LIKE ?) AND (books.book_owner_id=users.id) AND books.availability=TRUE
        ORDER BY ${orderBy} ${orderDirection}
        `,
          [`%${search}%`]
        );
      } else if (search && field === "Género") {
        queryResults = await connection.query(
          `
        SELECT books.id, books.creation_date, books.title, books.author, books.genre, books.synopsis, books.description, books.author_biography, books.book_owner_id, books.availability, users.location, users.name, books.image
        FROM books, users
        WHERE (books.genre LIKE ?) AND (books.book_owner_id=users.id) AND books.availability=TRUE
        ORDER BY ${orderBy} ${orderDirection}
        `,
          [`%${search}%`]
        );
      } else {
        queryResults = await connection.query(
          `
        SELECT books.id, books.creation_date, books.title, books.author, books.genre, books.synopsis, books.description, books.author_biography, books.book_owner_id, books.availability, users.location, users.name, books.image
        FROM books, users
        WHERE (books.author LIKE ? OR books.title LIKE ? OR users.location LIKE ? OR books.genre LIKE ?) AND (books.book_owner_id=users.id) AND books.availability=TRUE
        ORDER BY ${orderBy} ${orderDirection}
        `,
          [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
        );
      }
    } else {
      queryResults = await connection.query(
        `
        SELECT books.id, books.creation_date, books.title, books.genre, books.author, books.synopsis, books.description, books.author_biography, books.book_owner_id, books.availability, users.location, users.name, books.image
        FROM books, users
        WHERE books.book_owner_id=users.id AND books.availability=TRUE
        ORDER BY ${orderBy} ${orderDirection}`
      );
    }

    // Extraigo los resultados reales del resultado de la query
    const [result] = queryResults;

    // Mando la respuesta
    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listBooks;
