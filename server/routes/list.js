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
  const text_info = [1, "Введіть номер лічильника для відображення даних"];
  console.log(text_info);
  res.render("../views/list.hbs", {
    nav: nav,
    info: text_info,
  });
});

router.post("/", urlencodedParser, async (req, res) => {

  const { counter_number } = req.body;

  if (counter_number) {
    //Отримання та відображення даних для водоканала
    if (counter_number == "***" && req.session.isAuthenticated) {
      pool.query(
        `
          SELECT * FROM test_results 
          `,

        function (err, data) {
          if (err) return console.log(err);
          if (data != "") {
            const counter_dir = data[0].date + "-" + data[0].counter_number

            const text_info = [1, "Отримання всіх даних у вигляді таблиці"];
            //console.log('data ', data);
            console.log(text_info);

            const data_mod = data.map(obj => ({
              id: obj.id,
              address: obj.street +
                (obj.building_number ? ", " + obj.building_number : "") +
                (obj.letter ? "" + obj.letter : "") +
                (obj.corpus ? ", корпус " + obj.corpus : "") +
                (obj.apartment_number ? ", кв. " + obj.apartment_number : ""),
              date: obj.date,
              counter_type: obj.counter_type,
              installation_place: obj.comment,
              accuracy_class: obj.accuracy_class,
              document_number: obj.document_number,
              document_date: obj.document_date,
              counter_value: obj.counter_value,
              counter_number: obj.counter_number,
              counter_result: obj.counter_result,
              seal_number: obj.seal_number,
              isPaid: obj.isPaid,
            }));

            // const data_mod = data.map(obj => ({
            //   id: obj.id,
            //   // adress: obj.street + " " + obj.building_number + "" + obj.letter + "" + obj.corpus + obj.apartment_number == "" ? ", кв. ":", " + obj.apartment_number,
            //   //address: obj.street + " " + obj.building_number + (obj.apartment_number ? ", кв. " + obj.apartment_number : ""),

            //   date: obj.date,
            //   counter_type: obj.counter_type,
            //   installation_place: obj.comment,
            //   accuracy_class: obj.accuracy_class,
            //   document_number: obj.document_number,
            //   document_date: obj.document_date,
            //   counter_value: obj.counter_value,
            //   counter_number: obj.counter_number,
            //   counter_result: obj.counter_result,
            //   seal_number: obj.seal_number,
            //   isPaid: obj.isPaid,
            // }
            //))
            console.log('data_mod ', data_mod)


            res.render("list.hbs", {
              results_table_watercanal: data_mod,
              info: text_info,
              counter_dir: counter_dir,
            });
          } else {
            const text_info = [0, "Дані за введеними параметрами не знайдено"];
            console.log(text_info);
            res.render("list.hbs", {
              //results: data,
              info: text_info,
            });
          }

        }
      );
    } else {
      //Отримання та відображення даних для адміністратора
      if (counter_number == "**" && req.session.isAuthenticated) {
        pool.query(
          `
          SELECT * FROM test_results 
          `,

          function (err, data) {
            if (err) return console.log(err);
            if (data != "") {
              const counter_dir = data[0].date + "-" + data[0].counter_number

              const text_info = [1, "Отримання всіх даних у вигляді таблиці"];
              //console.log('data ', data[0]);
              console.log(text_info);


              const data_mod = data.map(obj => ({
                id: obj.id,
                date: obj.date,
                document_number: obj.document_number,
                counter_number: obj.counter_number,
                // counter_result:  obj.counter_result == "Придатний" ? 'checked' : '',
                counter_result: obj.counter_result,
                isPaid: obj.isPaid,
              }
              ))
              console.log('data_mod ', data_mod)


              res.render("list.hbs", {
                results_table: data_mod,
                info: text_info,
                counter_dir: counter_dir,
              });
            } else {
              const text_info = [0, "Дані за введеними параметрами не знайдено"];
              console.log(text_info);
              res.render("list.hbs", {
                //results: data,
                info: text_info,
              });
            }

          }
        );
      } else {
        if (counter_number == "*" && req.session.isAuthenticated) {
          pool.query(
            `
            SELECT * FROM test_results 
            `,

            function (err, data) {
              if (err) return console.log(err);
              if (data != "") {
                const counter_dir = data[0].date + "-" + data[0].counter_number
                const text_info = [1, "Отримано дані всіх лічильників"];
                console.log(text_info)


                res.render("list.hbs", {
                  results: data,
                  info: text_info,
                  counter_dir: counter_dir,
                });
              } else {
                const text_info = [0, "Дані за введеними параметрами не знайдено"];
                console.log(text_info);
                res.render("list.hbs", {
                  results: data,
                  info: text_info,
                });
              }

            }
          );
        } else {
          pool.query(
            `
            SELECT * FROM test_results WHERE counter_number = ?
            `,
            [counter_number],
            function (err, data) {
              if (err) return console.log(err);
              console.log(
                "Спроба отримати дані лічильника ",
                counter_number,
              );
              if (data != "") {
                //console.log('data', data)
                const counter_dir = data[0].date + "-" + data[0].counter_number

                //console.log('counter_dir ', counter_dir)
                const text_info = [
                  1,
                  "Отримано дані про лічильник: " +
                  counter_number
                ];
                console.log(text_info);
                res.render("list.hbs", {
                  results: data,
                  info: text_info,
                  counter_dir: counter_dir,
                });
              } else {
                const text_info = [0, "Дані за введеними параметрами не знайдено"];
                console.log(text_info);
                res.render("list.hbs", {
                  results: data,
                  info: text_info,
                })
              }
            }
          );
        }
      }
    }
  } else {
    const text_info = [0, "Поля для отримання даних не заповнені"];
    console.log(text_info);
    res.render("list.hbs", {
      info: text_info,
    })
  }
})

module.exports = router;
