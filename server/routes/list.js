const express = require("express");
const router = express.Router();
const nav = require("../../views/partials/nav");
const pool = require("../scripts/pool");
const urlencodedParser = express.urlencoded({ extended: false });
const {
  getFormattedDateTime,
  getFormattedDate,
} = require("../scripts/getFormattedDateTime");

router.get("/", function (req, res) {
  console.log("list");
  const text_info = [1, "Введіть адресу сайту"];
  console.log(text_info);
  res.render("../views/list.hbs", {
    nav: nav,
    info: text_info,
  });
});

router.post("/", urlencodedParser, async (req, res) => {

  const { site_link } = req.body;

  if (site_link) {
    // Вибір завдання з об'єкта ключ-значення 01 - посилання на сайт
    const text_info = [1, "Адреса сайту: " + site_link];
    console.log(text_info);
    res.render("list.hbs", {
      info: text_info,
    })
  } else {
    const text_info = [0, "Поля для отримання даних не заповнені"];
    console.log(text_info);
    res.render("list.hbs", {
      info: text_info,
    })
  }
})

module.exports = router;
