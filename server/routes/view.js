const express = require("express");
const router = express.Router();
const nav = require("../../views/partials/nav");
const pool = require("../scripts/pool");
const urlencodedParser = express.urlencoded({ extended: false });
const {
  getFormattedDateTime,
  getFormattedDate,
} = require("../scripts/getFormattedDateTime");

router.get("/", (req, res) => {
  res.redirect("/");
});

router.get("/:id", (req, res) => {
  console.log("view");
  const { id } = req.params;
  //
  pool.query(
    `
    SELECT * FROM test_results 
    WHERE id=?
    `,
    [id],
    function (err, data) {
      if (err) return console.log(err);
      const text_info = [1, `Перегляд протоколу ${id}`, "Номер лічильника:", data[0].counter_number];
      console.log(text_info);
      //console.log("data[0] ", data[0])
      res.render("../views/view.hbs", {
        result: data[0],
        info: text_info,
      })
    }
  )






});

module.exports = router;
