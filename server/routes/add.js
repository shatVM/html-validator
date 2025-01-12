const express = require("express");
const router = express.Router();
const nav = require("../../views/partials/nav");
const pool = require("../scripts/pool");
const urlencodedParser = express.urlencoded({ extended: false });
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");
const mysql = require("mysql2");

const {
  getFormattedDateTime,
  getFormattedDate,
} = require("../scripts/getFormattedDateTime");

// Імпорт функції отримання назв полів з БД з файлу getBDFields.js
const getBDFields = require("../scripts/getBDFields");

//Імпорт функції парсингу PDF файлу знідно з молеллю з файлу getBDFields.js
const parseLinesToModel = require("../scripts/parseLinesToModel");

router.get("/", function (req, res) {
  console.log("add");
  const text_info = [1, "Внесіть дані про повірку"];
  console.log(text_info);
  res.render("../views/add.hbs", {
    // nav: nav,
    info: text_info,
  });
});

// Налаштування Multer для зберігання файлів у папку "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });


// Маршрут для завантаження файлів
router.post("/", upload.fields([{ name: 'document', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
  //Отримання поточної дати та часу додавання даних
  const dateAdd = getFormattedDateTime();

  //Отримання даних з веб сторінки
  const { xls_data } = req.body;

  if (xls_data) {
    const split_xls_data = xls_data.replace("'", "\\'").split("\t");
    const text_info = [1, "Отримано дані з полів таблиці XLS"];
    console.log( text_info);
    const counter_number = split_xls_data[19]
    const counter_date = split_xls_data[17]
    // Завантаження PDF файлів на сервер

    const documentFile = req.files.document[0];
    const pdfFile = req.files.pdf[0];

    // Створення папки для завантаження документів дата-номер
    const counter_dir = counter_date + "-" + counter_number
    const dirPath = path.join(__dirname, "../../public/uploads/", counter_dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Переміщення файлів у створену папку
    const documentFilePath = path.join(dirPath, documentFile.filename);
    const pdfFilePath = path.join(dirPath, pdfFile.filename);
    fs.renameSync(documentFile.path, documentFilePath);
    fs.renameSync(pdfFile.path, pdfFilePath);
    //console.log("Файли завантажено на сервер ", documentFile, " ", pdfFile.originalname);
    //const fileNamePDF = pdfFile.originalname;

    // Шлях до файлу з даними з таблиці XLS
    const txtFileName = counter_number + ".txt"
    const txtFilePath = path.join(__dirname, "../../public/uploads/", counter_dir, txtFileName);
    //console.log(getFormattedDateTime(), txtFilePath);
    // Запис даних у файл 
    fs.writeFileSync(txtFilePath, xls_data, 'utf8');
    console.log("Створено текстовий файл з даними з таблиці XLS");

    //Видалення першого значення тому що в таблиці ІД некоректний
    split_xls_data.shift();

    // split_xls_data.pop() видалення останного значення якщо це потрібно
    // res.render("../views/add.hbs", {
    //   info: text_info,
    // });

    //Отримання текстових даних з файлу
    let dataFromPDF = await extractDataFromPdf(pdfFilePath);
    console.log("Здійснено парсинг PDF файлу ");

    //Створення об'єкту з тектових даних за моделлю
    const counter_objectJS = parseLinesToModel(dataFromPDF);
    console.log("Дані PDF файлу перетворено на об'єкт JS")

    //Отримання підсумкового результату тесту повірки лічильника
    //const counter_number = counter_objectJS["№ лічильника"];
    const counter_result = counter_objectJS["Результат теста"];
    const counter_type = counter_objectJS["Тип лічильника"];
    const counter_year = counter_objectJS["Рік виробництва"];
    const counter_value = counter_objectJS["Об'єм, м³"];

    console.log("Результат повірки лічильника: ", counter_result)

    const counter_objectJSON = JSON.stringify(counter_objectJS, null, 4);
    console.log("Дані PDF файлу перетворено на об'єкт JSON"    );

    //DOCUMENT
    const { document_number } = req.body
    const { document_date } = req.body
    const { document_validity_date } = req.body
    const { paid } = req.body
    const isPaid = paid ? 'checked' : ''
    const accuracy_class = ""

    console.log("Стан оплати відмічено як ", isPaid);

    //Підготовка об'єкту до SQL запиту. Заміна ' на \' для коректного формуванні запиту
    const counter_objectToDB = counter_objectJSON.replace(/'/g, "\\'");

    // const fileNameDOC = documentFile.originalname;
    // const fileNamePDF = pdfFile.originalname;

    // console.log("fileNameDOC ", fileNameDOC)
    // console.log("fileNamePDF ", fileNamePDF)

    //Масив додаткових параметрів, які необхідні для внесення в БД
    const arrayOfAddedParams = [
      counter_objectToDB,
      documentFile.filename,
      pdfFile.filename,
      dateAdd,
      counter_result,
      counter_type,
      counter_year,
      counter_value,
      document_number,
      document_date,
      document_validity_date,
      isPaid,
      accuracy_class
    ];

    getBDFields(pool, arrayOfAddedParams)
      .then((fields) => {
        //console.log("Отримані поля з бази даних:", fields);
        fields.shift();
        const db_fields = fields
          .map((data, index) => {
            return `${data}`;
          })
          .join(", ");

        arrayOfAddedParams.forEach((e) => {
          split_xls_data.push(e);
        });

        const xls_values = split_xls_data
          .map((data, index) => {
            return `'${data}'`;
          })
          .join(", ");

        //console.log("DB:", db_fields);
        // console.log("xls_values ", xls_values);

        //створити обєкт у якого імена полів отримуюсться з db_fields а значення з split_xls_data 
        // Split the strings into arrays
        const fieldsArray = db_fields.split(', ');
        //const valuesArray = split_xls_data.split(',');
        // Create the object
        const resultObject = {};

        // Ensure both arrays are the same length to avoid undefined values
        if (fieldsArray.length === split_xls_data.length) {
          for (let i = 0; i < fieldsArray.length; i++) {
            resultObject[fieldsArray[i]] = split_xls_data[i];
          }
        } else {
          console.error('Fields and values arrays have different lengths.');
        }

        if (fields.length == split_xls_data.length) {
          const text_info = [1, "Кількість полів та значень співпадають"]
          console.log(text_info);

          let id
          let sql_query = generateSql(db_fields, xls_values)
          //console.log('sql_query ', sql_query);
          insertToDB(sql_query)
            .then(resultId => {
              id = resultId
              //console.log(id)

              res.render("../views/result.hbs", {
                id: id,
                results: resultObject,
                json: counter_objectJSON,
                document: "uploads/" + counter_dir + "/" + documentFile.filename,
                pdf: "uploads/" + counter_dir + "/" + pdfFile.filename,
                sql_query: sql_query,

                //txt: "uploads/" + counter_dir + "/" + txtFileName //Доробити для збереження текстового фрагменту з XLS файлу
              });
              // Подальші дії з використанням id
            })
            .catch(error => {
              console.log("Error:", error.message);
            });
        } else {
          const text_info = [0, "Кількість значень з таблиці XLS не співпадають з кількістю полів в базі даних"]
          console.log(text_info);
          res.render("add.hbs", {
            info: text_info,
          });
        }
        // Виконуйте інші операції з полями або базою даних тут
      })
      .catch((error) => {
        const text_info = [0, "Виникла помилка при роботі зі зчитуванням полів Бази даних. Спробуйте ще раз"]
        console.error(text_info, error);
        console.log(text_info);
        res.render("add.hbs", {
          info: text_info,
        })
      })

  } else {
    const text_info = [
      0,
      "Виникла помилка при роботі зі зчитуванням полів таблиці XLS",
    ];

    console.log(text_info);
    res.render("add.hbs", {
      info: text_info,
    });
  }

});

async function extractDataFromPdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

function generateSql(fields, xls_values) {
  try {
    // Формування SQL-запиту на вставку
    const xls_sql = `
                      INSERT INTO test_results (
                          ${fields} 
                      ) 
                      VALUES (
                          ${xls_values}
                      );
                  `;
    console.log("Сформовано запит SQL");
    //console.log("xls_sql ", xls_sql)
    return xls_sql;
  } catch {
    console.log("Помилка при формуванні запиту SQL");
  }
}

function insertToDB(sql) {
  return new Promise((resolve, reject) => {
    pool.query(sql, (error, data) => {
      if (error) {
        console.log(" Не завантажено :", error.message);
        reject(error);
      } else {
        console.log("Завантажено в БД з ІД:", data.insertId);
        resolve(data.insertId);
      }
    });
  });
}

module.exports = router;
