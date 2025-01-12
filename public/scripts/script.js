//Для мобільного бургер меню
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});

//Для відображення модального вікна
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

//Для відображення календаря
// Ініціалізація Datepicker з українськими налаштуваннями
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.datepicker');
  var options = {
    firstDay: 1, // Початок тижня з понеділка
    format: 'dd.mm.yyyy', // Формат дати
    showClearBtn: true,
    i18n: {
      cancel: 'Скасувати',
      clear: 'Очистити',
      done: 'Готово',
      months: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
      monthsShort: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
      weekdays: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'],
      weekdaysShort: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'],
      weekdaysAbbrev: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    }
  };
  var instances = M.Datepicker.init(elems, options);
});

//Для відображення згортаючого списку пдф
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems);
});


//Парсинг XLS файлу
// function displayPairs() {
//   const fieldNames = [
//       "id", "Номер_глобальний", "№_протоколу", "ПІБ", "Місто", "Вулиця", "Будинок", 
//       "Літера", "Корпус", "Квартира", "Літера", "Адреса", "№_пломби", "Телефон_осн.", 
//       "Телефон_дод.", "Телефон_дод2.", "E-mail", "Дата", "Час", "№_лічильника", 
//       "Тип_послуги", "Коментар", "Станція"
//   ];

//   const data = document.getElementById('xls_data').value;
//   const pairsDiv = document.getElementById('pairs');
//   pairsDiv.innerHTML = ''; // Clear previous pairs

//   const rows = data.split('\n');
//   rows.forEach(row => {
//       const columns = row.split('\t');

//       for (let i = 0; i < columns.length; i++) {
//           const pair = document.createElement('div');
//           pair.textContent = `${fieldNames[i]}: ${columns[i]}`;
//           pairsDiv.appendChild(pair);
//       }
//       pairsDiv.appendChild(document.createElement('br')); // Separate entries with a line break
//   });
// }

function displayTable() {
  const fieldNames = [
    "id", "Номер_глобальний", "№_протоколу", "ПІБ", "Місто", "Вулиця", "Будинок",
    "Літера", "Корпус", "Квартира", "Літера", "Адреса", "№_пломби", "Телефон_осн.",
    "Телефон_дод.", "Телефон_дод2.", "E-mail", "Дата", "Час", "№_лічильника",
    "Тип_послуги", "Коментар", "Станція"
  ];

  const data = document.getElementById('xls_data').value;
  const tableBody = document.getElementById('data-table');
  tableBody.innerHTML = ''; // Clear previous table rows

  const rows = data.split('\n');
  rows.forEach(row => {
    const columns = row.split('\t');

    columns.forEach((column, index) => {
      const tableRow = document.createElement('tr');

      const tableHeader = document.createElement('th');
      tableHeader.textContent = fieldNames[index];
      tableRow.appendChild(tableHeader);

      const tableData = document.createElement('td');
      tableData.textContent = column;
      tableRow.appendChild(tableData);

      tableBody.appendChild(tableRow);
    });
  });
}


//Попередній перегляд ПДФ
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('input[name="pdf"]')) {
    document.querySelector('input[name="pdf"]').addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = function () {
          const typedArray = new Uint8Array(this.result);

          pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
            // Отримати першу сторінку
            pdf.getPage(1).then(function (page) {
              const scale = 1.4;
              const viewport = page.getViewport({ scale: scale });

              const canvas = document.getElementById('pdf-preview');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              page.render(renderContext);
            });
          });
        };

        fileReader.readAsArrayBuffer(file);
      } else {
        alert('Будь ласка, виберіть PDF-файл.');
      }
    });
  }

});

//Попередній перегляд ДОКУМЕНТУ
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('input[name="document"]')) {
    document.querySelector('input[name="document"]').addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = function () {
          const typedArray = new Uint8Array(this.result);

          pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
            // Отримати першу сторінку
            pdf.getPage(1).then(function (page) {
              const scale = 1.4;
              const viewport = page.getViewport({ scale: scale });

              const canvas = document.getElementById('document-preview');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              page.render(renderContext);
            });
          });
        };

        fileReader.readAsArrayBuffer(file);
      } else {
        alert('Будь ласка, виберіть PDF-файл.');
      }
    });
  }
});

// Сортуванн'я таблиці

function sortTable(columnIndex, order) {
  const table = document.querySelector('.striped tbody');
  const rows = Array.from(table.rows);
  rows.sort((a, b) => {
    let aContent = a.cells[columnIndex].textContent.trim();
    let bContent = b.cells[columnIndex].textContent.trim();
    
    if (columnIndex === 12) {
      aContent = a.cells[columnIndex].querySelector('input').checked ? 1 : 0;
      bContent = b.cells[columnIndex].querySelector('input').checked ? 1 : 0;
    } else if (columnIndex === 6) {
      aContent = formatDate(aContent);
      bContent = formatDate(bContent);
    }
    
    if (order === 'asc') {
      return aContent > bContent ? 1 : -1;
    } else {
      return aContent < bContent ? 1 : -1;
    }
  });
  rows.forEach(row => table.appendChild(row));
  renumberTable()
}

function formatDate(dateStr) {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day).getTime();
}


// Фільтрація даних таблиці по даті

document.addEventListener('DOMContentLoaded', function () {
  var inputs = document.querySelectorAll('thead input');
  // console.log(inputs)
  inputs.forEach(function (input, index) {
    input.addEventListener('input', function () {
      // input.addEventListener('change', function() {
      filterTable(index+1, input.value);
      renumberTable()
    });
  });
});

function filterTable(colIndex, filterValue) {
  var table = document.getElementsByTagName('table')[0];
  var tr = table.getElementsByTagName('tr');
  for (var i = 2; i < tr.length; i++) {
    var td = tr[i].getElementsByTagName('td')[colIndex];
    if (td) {
      if (td.textContent.indexOf(filterValue) > -1 || filterValue === '') {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}

//Перенумерація рядків таблиці
function renumberTable() {
  var table = document.getElementsByTagName('table')[0];
  var tr = table.getElementsByTagName('tr');
  var num = 1;

  for (var i = 2; i < tr.length; i++) {
    if (tr[i].style.display !== 'none') {
      var td = tr[i].getElementsByTagName('td')[0];
      if (td !== undefined) {
        td.innerText = num;
        num++;
      }
    }
  }
}

//Відображення логування

document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.file-link');
  const contentDisplay = document.getElementById('fileContent');

  const colorFormat = {
    'Спроба відкрити маршрут без прав Адміністратора': 'red lighten-5',
    'Редагування протоколу': 'amber lighten-5',
    'Збереження змін протоколу': 'light-green lighten-4',
    'Завантажено в БД з ІД': 'light-green lighten-2',
    'увійшов': 'cyan lighten-2',
    'вийшов': 'cyan lighten-4',
    'Дані за введеними параметрами не знайдено': 'red lighten-5',
    'Відображення логів сервера': 'teal lighten-5',
    'Видалення лічильника': 'red lighten-3',
    
  };

  links.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const content = this.getAttribute('data-content');
      contentDisplay.innerHTML = formatLogContent(content);
    });
  });

  function formatLogContent(content) {
    const logEntries = content.split(/(\r\n|\n|\r)/).filter(entry => entry.trim() !== '');
    return logEntries.reverse().map(entry => {
      const [timestamp, ...messageParts] = entry.split(' LOG: ');
      const message = messageParts.join(' LOG: ');
      let entryClass = '';

      for (const [key, value] of Object.entries(colorFormat)) {
        if (message.includes(key)) {
          entryClass = value;
          break;
        }
      }

      return `
              <div class="log-entry ${entryClass}">
                  <span class="log-timestamp">${timestamp}</span>
                  <span class="log-message">${message}</span>
              </div>
          `;
    }).join('');
  }
});


