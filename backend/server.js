require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const isUser = require("./middlewares/isUser");
const isAdmin = require("./middlewares/isAdmin");
const entryExists = require("./middlewares/entryExists");

// Content controllers;
const listBooks = require("./controllers/content/listBooks");
const getBook = require("./controllers/content/getBook");
const newBook = require("./controllers/content/newBook");
const editBook = require("./controllers/content/editBook");
const deleteBook = require("./controllers/content/deleteBook");

// User controllers
const newUser = require("./controllers/users/newUser");
const validateUser = require("./controllers/users/validateUser");
const loginUser = require("./controllers/users/loginUser");
const getUser = require("./controllers/users/getUser");
const editUser = require("./controllers/users/editUser");
const deleteUser = require("./controllers/users/deleteUser");
const editUserPassword = require("./controllers/users/editUserPassword");
const recoverUserPassword = require("./controllers/users/recoverUserPassword");
const resetUserPassword = require("./controllers/users/resetUserPassword");

// Exchanges controllers
const requestBook = require("./controllers/exchanges/requestBook");
const confirmRequest = require("./controllers/exchanges/confirmRequest");
const rejectRequest = require("./controllers/exchanges/rejectRequest");
const voteUser = require("./controllers/exchanges/voteUser");

const app = express();

// Middlewares iniciales

// Log de peticiones a la consola
app.use(morgan("dev"));

// Procesado de body tipo json
app.use(bodyParser.json());

// Procesado de body tipo form-data
app.use(fileUpload());

/*
  ENDPOINTS DE CONTENIDO
*/

// Listar multiples libros
// GET - /books
// Público
app.get("/books", listBooks);

// Mostrar un solo libro
// GET - /books/:id
// Público
app.get("/books/:id", entryExists, getBook);

// Publicar un libro
// POST - /entries
// Sólo usuarios registrados
app.post("/books", isUser, newBook);

// Editar un libro
// PUT - /entries/:id
// Sólo usuario que creara esta entrada o admin
app.put("/books/:id", isUser, entryExists, editBook);

// Borrar un libro
// DELETE - /entries/:id
// Sólo usuario que creara esta entrada o admin
app.delete("/books/:id", isUser, entryExists, deleteBook);

/*
  ENDPOINTS DE USUARIO
*/

// Registro de usuarios
// POST - /users
// Público
app.post("/users", newUser);

// Validación de usuarios registrados
// GET - /users/validate/:code
// Público
app.get("/users/validate/:code", validateUser);

// Login de usuarios
// POST - /users/login
// Público
app.post("/users/login", loginUser);

// Ver información de un usuario
// GET - /users/:id
// Sólo para usuarios registrados
// Pero si el usuario es el mismo o admin debería mostrar toda la información
app.get("/users/:id", isUser, getUser);

// Editar datos de usuario: email, name, avatar
// PUT - /users/:id
// Sólo el propio usuario o el usuario admin
app.put("/users/:id", isUser, editUser);

// Borrar un usuario
// DELETE- /users/:id
// Sólo el usuario admin
app.delete("/users/:id", isUser, isAdmin, deleteUser);

// Editar password de usuario
// POST - /users/:id/password
// Sólo el propio usuario
app.post("/users/:id/password", isUser, editUserPassword);

// Enviar código de reset de password
// POST - /users/recover-password
// Público
app.post("/users/recover-password", recoverUserPassword);

// Resetear password de usuario
// POST - /users/reset-password
// Público
app.post("/users/reset-password", resetUserPassword);

/*
  ENDPOINTS DE INTERCAMBIOS
*/

//Enviar una petición para intercambio de libro
//POST - /books/:id/request
//Solo usuarios
app.post("/books/:id/request", isUser, requestBook);

//Confirmar petición de intercambio de libro
//POST - /request/:id/confirm
//Solo el usuario al que le realizaron la petición
app.post("/request/:id/confirm", isUser, confirmRequest);

//Rechazar petición de intercambio de libro
//POST - /request/:id/reject
//Solo el usuario al que le realizaron la petición
app.post("/request/:id/reject", isUser, rejectRequest);

//Votar usuario
//POST - /request/:id/votes
//Solo los dos usuarios que realizaron el intercambio
app.post("/request/:id/votes", isUser, voteUser);

// Middlewares finales

// Error middleware
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

// Not found
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port}`);
});
