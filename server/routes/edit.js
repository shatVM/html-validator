const express = require("express");
const router = express.Router();
const urlencodedParser = express.urlencoded({ extended: false });
const pool = require("../scripts/pool");
const {
  getFormattedDateTime,
  getFormattedDate,
} = require("../scripts/getFormattedDateTime");

// Імпорт функції отримання назв полів з БД з файлу getBDFields.js
const getBDFields = require("../scripts/getBDFields");

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
router.get("/:id", function (req, res) {
  const { id } = req.params;
  const text_info = [1, `Редагування протоколу ${id}`];
  console.log(text_info);
  pool.query(
    `
      SELECT * FROM test_results 
      WHERE id=?
      `,
    [id],
    function (err, data) {
      if (err) return console.log(err);
      res.render("../views/edit.hbs", {
        
        result: data[0],
        info: text_info,
      });
    }
  );
});

// получаем отредактированные данные и отправляем их в БД
router.post("/", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);

  getBDFields(pool).then((fields) => {
    //console.log("Отримані поля з бази даних:", fields);
    // const values = fields.map((field) => req.body[field]);
    const values = fields.map((field) => {
      if (field === 'isPaid') {
        return req.body[field] === 'on' ? 'checked' : '';
      }
      return req.body[field];
    });
    values.push(req.body.id); // Add the id for the WHERE clause

    const sql = `
      UPDATE test_results 
      SET ${fields.map((field) => `${field} = ?`).join(", ")}
      WHERE id = ?`
console.log('values ',values[0])
    pool.query(sql, values, function (err, data) {
      if (err) return console.log(err);
      const text_info = [1, `Збереження змін протоколу ${req.body.id}`];
      console.log(text_info);
      res.redirect(`/view/${req.body.id}`);
    });
  });
});

module.exports = router;
