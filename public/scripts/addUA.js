const uaFields = [
  'Переклад полів БД', // Translation of DB fields
  'Номер запису в БД', // Record ID in DB
  'Глобальний номер', // global_number
  'Номер протоколу', // protocol_number
  'ПІБ', // full_name
  'Місто', // city
  'Вулиця', // street
  'Номер будинку', // building_number
  'Літера', // letter
  'Корпус', // corpus
  'Номер квартири', // apartment_number
  'Адреса з літерою', // address_letter
  'Повна адреса', // full_address
  'Номер пломби', // seal_number
  'Основний телефон', // primary_phone
  'Додатковий телефон 1', // additional_phone1
  'Додатковий телефон 2', // additional_phone2
  'Електронна пошта', // email
  'Дата', // date
  'Час', // time
  'Номер лічильника', // counter_number
  'Тип послуги', // service_type
  'Коментар', // comment
  'Станція', // station
  'Інформація про тест', // test_info
  'Ім’я файлу документа', // document_file_name
  'Ім’я файлу протоколу', // protocol_file_name
  'Дата додавання', // dateAdd
  'Результат лічильника', // counter_result
  'Тип лічильника', // counter_type
  'Рік лічильника', // counter_year
  'Показники лічильника', // counter_value
  'Номер документа', // document_number
  'Дата документа', // document_date
  'Дата дії документа', // document_validity_date
  'Сплачено', // isPaid
  'Клас точності', // accuracy_class
];

function addTranslationColumn() {
  const table = document.getElementById("dataTable");
  console.log(table)
  const rows = table.getElementsByTagName("tr");

  // Додати заголовок для нового стовпчика аівпвап
  const headerCell = document.createElement("th");
  headerCell.innerText = "Поле";
  headerCell.style.width = "200px"; // Встановлюємо ширину 200 пікселів
  rows[0].prepend(headerCell);

  // Перекладати значення кожного рядка і додавати в новий стовпчик
  for (let i = 1; i < rows.length; i++) {
    const originalText = rows[i].getElementsByTagName("td")[0].innerText;
    const translatedText = uaFields[i]

    const newCell = document.createElement("td");
    newCell.innerText = translatedText;
    rows[i].prepend(newCell);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const url = window.location.href;

  if (url.includes('edit')) {
    //addTranslationColumnEdit();
  } else if (url.includes('view')) {
    addTranslationColumn();
  }
});

function addTranslationColumnEdit(){
  const labels = document.querySelectorAll('label'); // або використовуйте клас, якщо потрібно
  labels.forEach((label, index) => {
    if (index < uaFields.length && uaFields[index] !== 'Сплачено') { // Перевіряємо на ключ isPaid
      label.innerText += `: ${uaFields[index-1]}`; // Додаємо текст з масиву
    }
  });
}
