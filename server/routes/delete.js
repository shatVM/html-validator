const express = require("express");
const router = express.Router();
const nav = require("../../views/partials/nav");
const pool = require("../scripts/pool");
const fs = require("fs");

const {
  getFormattedDateTime,
  getFormattedDate,
} = require("../scripts/getFormattedDateTime");

// отримуємо id запису і видаляємо його з БД
router.post("/:id", function (req, res) {
  const { id } = req.params;
  const text_info = [1]

  //Видалення папки з файлами
  pool.query(
    `
        SELECT * FROM test_results WHERE id = ?
        `,
    [id],
    function (err, data) {
      if (err) return console.log(err);
      console.log("Спроба отримати дані лічильника ", id);
      if (data != "") {
        // console.log('data', data)

        const counter_dir = data[0].date + "-" + data[0].counter_number

        //console.log('counter_dir ', counter_dir)

        // Видалення папки з файлами
        const dirPath = `public/uploads/${counter_dir}`; // Шлях до папки
        //console.log('dirPath ', dirPath)

        if (fs.existsSync(dirPath)) { // Перевірка чи існує папка
          fs.rmSync(dirPath, { recursive: true });
          text_info.push(
            `Видалення лічильника ${data[0].counter_number}. Видалено папку ${dirPath} з сервера.`
          );
          
          //Видалення з Бази даних
          pool.query(
            `
      DELETE FROM test_results 
      WHERE id=?
      `,
            [id],
            function (err, data) {
              if (err) return console.log(err);
              text_info[1] = text_info[1] + ` Видалено запис ${id} з БД`;
              console.log(text_info);

              res.render("../views/list.hbs", {

                info: text_info,
              })
            }
          )
        } else {
          text_info.push(
            `Лічильник ${data[0].counter_number} не знайдено. Папка ${dirPath} не існує на сервері.`
          );
          res.render("../views/list.hbs", {

            info: text_info,
          })
        }

        console.log(text_info);

        //   if (dirPath) {
        //     fs.rmSync(dirPath, { recursive: true })
        //   }

        //  text_info.push(
        //     `Видалення лічильника ${data[0].counter_number}. ❌ папку ${dirPath} з сервера. `);
        //   console.log(text_info);

      }
    }
  );

})

module.exports = router;