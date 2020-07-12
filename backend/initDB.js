require("dotenv").config();

const faker = require("faker/locale/es");
const { getConnection } = require("./db");
const { formatDateToDB } = require("./helpers");
const { random } = require("lodash");

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
      INSERT INTO users(registration_date, email, password, role, name, active, update_date)
      VALUES(NOW(), "andres.canosa.quintero@gmail.com", SHA2("${process.env.DEFAULT_ADMIN_PASSWORD}", 512), "admin", "Andrés Canosa", true, NOW())
    `
    );

    console.log("Metiendo datos de prueba en users");
    const users = 20;

    for (let index = 0; index < users; index++) {
      const email = faker.internet.email();
      const name = faker.name.findName();
      const location = faker.address.city();
      const phoneNumber = faker.phone.phoneNumber();
      const birthdate = formatDateToDB(faker.date.past());

      await connection.query(
        `
        INSERT INTO users(registration_date, email, password, role, name, update_date, creation_date, location, phone_number, birthdate)
        VALUES(NOW(), "${email}", SHA2("${faker.internet.password()}", 512), "normal", "${name}", NOW(), NOW(), "${location}", "${phoneNumber}", "${birthdate}")
      `
      );
    }

    console.log("Metiendo datos de prueba en books");

    const books = 50;

    for (let index = 0; index < books; index++) {
      await connection.query(`
        INSERT INTO books(availability, title, author, description, synopsis, author_biography, update_date, creation_date, book_owner_id)
        VALUES(
          TRUE,
          "${faker.lorem.sentence()}", 
          "${faker.name.findName()}", 
          "${faker.lorem.paragraph()}",
          "${faker.lorem.paragraph()}", 
          "${faker.lorem.paragraph()}",  
          NOW(), 
          NOW(),
          "${random(2, users + 1)}")
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
