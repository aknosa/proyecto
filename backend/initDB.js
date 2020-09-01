require("dotenv").config();

const faker = require("faker/locale/es");
const { getConnection } = require("./db");
const { formatDateToDB } = require("./helpers");
const { random, sample } = require("lodash");

let connection;

async function main() {
  try {
    // Conseguir conexión a la base de datos
    connection = await getConnection();

    // Borrar el contenido de las tablas
    console.log("Borrando el contenido de las tablas");
    await connection.query("DELETE FROM exchanges;");
    await connection.query("DELETE FROM books;");
    await connection.query("DELETE FROM users;");

    await connection.query("ALTER TABLE exchanges AUTO_INCREMENT=1;");
    await connection.query("ALTER TABLE books AUTO_INCREMENT=1;");
    await connection.query("ALTER TABLE users AUTO_INCREMENT=1;");

    // Meter datos de prueba en las tablas

    console.log("Creando usuario administrador");

    await connection.query(
      `
      INSERT INTO users(registration_date, email, password, role, name, active, update_date, image)
      VALUES(NOW(), "andres.canosa.quintero@gmail.com", SHA2("${process.env.DEFAULT_ADMIN_PASSWORD}", 512), "admin", "Andrés Canosa", true, NOW(), "usuario1.jpg")
    `
    );

    console.log("Metiendo datos de prueba en users");

    const users = 40;

    for (let index = 0; index < users; index++) {
      const email = faker.internet.email();
      const name = faker.name.findName();
      const location = faker.address.city();
      const phoneNumber = faker.phone.phoneNumber();
      const birthdate = formatDateToDB(faker.date.past());

      await connection.query(
        `
        INSERT INTO users(registration_date, email, password, role, name, update_date, creation_date, location, phone_number, birthdate, image)
        VALUES(NOW(), "${email}", SHA2("${faker.internet.password()}", 512), "normal", "${name}", NOW(), NOW(), "${location}", "${phoneNumber}", "${birthdate}", "usuario1.jpg")
      `
      );
    }

    console.log("Metiendo datos de prueba en books");

    const books = 100;
    const genres = [
      "Poesía",
      "Teatro",
      "Terror",
      "Policiaca",
      "Ciencia ficción",
      "Fantasía",
      "Cómic",
      "Romántica",
      "Arte",
      "Historia y política",
      "Gastronomía",
      "Salud",
      "Deportes",
      "Infantil",
      "Ficción histórica",
    ];

    for (let index = 0; index < books; index++) {
      await connection.query(`
        INSERT INTO books(availability, title, author, genre, description, synopsis, author_biography, update_date, creation_date, book_owner_id, image)
        VALUES(
          TRUE,
          "${faker.lorem.sentence()}", 
          "${faker.name.findName()}",
          "${sample(genres)}", 
          "${faker.lorem.paragraph()}",
          "${faker.lorem.paragraph()}", 
          "${faker.lorem.paragraph()}",  
          NOW(), 
          NOW(),
          "${random(2, users + 1)}",
          "libro1.jpg")
      `);
    }
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Todo hecho, liberando conexión");
    if (connection) connection.release();
    process.exit();
  }
}

main();
