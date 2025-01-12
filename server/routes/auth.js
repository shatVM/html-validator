const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const session = require("express-session");
const nav = require("../../views/partials/nav");
const {
  getFormattedDateTime,
  getFormattedDate,
} = require("../scripts/getFormattedDateTime");

// Middleware для парсингу JSON та URL-закодованих даних
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Налаштування сесій
router.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Налаштування системи користувачів (логін і пароль)
const users = [
  { username: "Admin", password: "DEV-Water0", isAdmin: true },
  { username: "Manager", password: "DEV-Water1", isAdmin: true },
  { username: "Watercanal", password: "Povirka-Water1", isAdmin: false },
]

// Обробка логіна
router.post("/", (req, res) => {
  const { username, password } = req.body;

  // Знайти користувача
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Встановити сесію як автентифіковану
    req.session.isAuthenticated = true;
    req.session.username = user.username;

    // Перевірити, чи користувач є адміністратором
    // Тут передбачається, що ваш об'єкт user має властивість isAdmin
    if (user.isAdmin) {
      req.session.isAdmin = true;
      console.log("Користувач ", user.username, " увійшов як адміністратор");
    } else {
      req.session.isAdmin = false;
      console.log("Користувач ", user.username, " увійшов");
    }

    // Перенаправити на домашню сторінку
    res.redirect("/");
  } else {
    // Невірний логін або пароль
    res.redirect("/");
  }
});

// Вихід
router.get("/", (req, res) => {
  console.log("Користувач ", req.session.username, " вийшов");
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
