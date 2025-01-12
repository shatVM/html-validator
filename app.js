const express = require("express");
const hbs = require("hbs");
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const session = require('express-session');
const crypto = require('crypto');

const app = express();
const PORT = 8080;

// Налаштування пула підключення до БД
const pool = require("./server/scripts/pool");

//Налаштування шаблонізатора
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

//Функція для можливості порівняння в hbs
hbs.registerHelper('eq', function(arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});
//Функція додавання в hbs
hbs.registerHelper('add', function(a, b) {
  return a + b;
});

// Налаштування статичних файлів
app.use(express.static(path.join(__dirname, "public")));

// Підключення роутів
const indexRouter = require("./server/routes/index")
const tasksRouter = require("./server/routes/tasks")
const listRouter = require("./server/routes/list")
const addRouter = require("./server/routes/add")
const viewRouter = require("./server/routes/view")
const deleteRouter = require("./server/routes/delete"); 
const editRouter = require("./server/routes/edit"); 
const authRouter = require("./server/routes/auth")
const logsRouter = require("./server/routes/logs")


//Імпортуємо функцію форматування дати та дати з часом
const {getFormattedDateTime, getFormattedDate} = require("./server/scripts/getFormattedDateTime")
// Імпортуємо модулі з папки "server/scripts"
//Функція для логування повідомлень з консолі
require("./server/scripts/logger/logger");

//Використання .env файлу для зберігання ключа
require('dotenv').config();

//--------------------------------------------------------

// Імпортуємо middleware для сесій
const sessionMiddleware = require("./server/middleware/sessionMiddleware");

// Імпортуємо middleware для перевірки ролі адміністратора
const isAuthenticatedMiddleware = require("./server/middleware/isAuthenticatedMiddleware");
const isAdminMiddleware = require("./server/middleware/isAdminMiddleware");

// Налаштування middleware для сесій
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // встановити true, якщо використовуєте HTTPS
}));

// Використання middleware для передачі сесійних змінних
app.use(sessionMiddleware)



//--------------------------------------------------------

// Встановлення маршрутів
app.use("/", indexRouter)
app.use("/list", listRouter)
app.use("/tasks", tasksRouter)
app.use("/view", isAuthenticatedMiddleware, viewRouter) // Використання middleware для перевірки авторизованого користувача перед маршрутом 
app.use("/add", isAdminMiddleware, addRouter) // Використання middleware для перевірки адміністратора перед маршрутом 
app.use("/delete", isAdminMiddleware, deleteRouter)
app.use("/edit", isAdminMiddleware, editRouter)
app.use("/auth", authRouter)
app.use("/logout", authRouter)
app.use("/logs", isAdminMiddleware, logsRouter)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})


