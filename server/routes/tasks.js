const express = require("express");
const router = express.Router();
const nav = require("../../views/partials/nav");
const pool = require("../scripts/pool");
const { getFormattedDateTime, getFormattedDate } = require("../scripts/getFormattedDateTime");

// Для підтримки JSON даних
router.use(express.json());

router.get("/", function (req, res) {
  console.log("tasks");
  const text_info = [1, "Обране завдання"];
  console.log(text_info);
  res.render("../views/list.hbs", {
    nav: nav,
    info: text_info,
  });
});

router.post("/", async (req, res) => {
  const { task } = req.body;

  if (task) {
    // Вибір завдання з об'єкта ключ-значення 01 - посилання на сайт
    const text_info = [1, "Завдання номер " + task];
    console.log(text_info);
    res.json({ info: text_info }); // Відправляє JSON-дані замість шаблону
  } else {
    const text_info = [0, "Поля для отримання даних не заповнені"];
    console.log(text_info);
    res.json({ info: text_info }); // Відправляє JSON-дані замість шаблону
  }
});

module.exports = router;
