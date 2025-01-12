document.addEventListener('DOMContentLoaded', function () {
  const tableButton = document.getElementById('export-xlsx-btn')
  if (tableButton) {
    tableButton.addEventListener('click', function () {
      // exportTableToExcel()
      tableToExcel()
    })
  }
});


function setColumnWidths(ws) {
    ws['!cols'] = [ 
        { wpx: 40 },   //0 №
        { wpx: 220 },  //1 Адреса
        { wpx: 100 },  //2 Лічильник, текстовий формат
        { wpx: 80 },   //3 Тип повірки
        { wpx: 80 },   //4 Нак. об'єм
        { wpx: 100 },  //5 Номер документу
        { wpx: 100 },  //6 Дата документу
        { wpx: 100 },  //7 Статус
        { wpx: 80 },   //8 Номер пломби
        { wpx: 80 },   //9 Клас точності
        { wpx: 100 },  //10 Тип лічильника
        { wpx: 200 },  //11 Місце встановлення
    ];
}

function setBoldFirstRow(ws) {
    // Додаємо форматування для першого рядка
    var range = XLSX.utils.decode_range(ws['!ref']);
    for (var C = range.s.c; C <= range.e.c; ++C) {
        var cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) continue;
        if (!ws[cellAddress].s) ws[cellAddress].s = {}; // Перевіряємо, чи вже є стиль
        ws[cellAddress].s.font = { bold: true };  // Встановлюємо жирний шрифт для першого рядка
    }
}

function tableToExcel() {
    // Отримуємо таблицю
    var table = document.querySelector("table.striped");
    var data = [];
    
    // Проходимо по кожному рядку таблиці починаючи з 2-го рядка
    var rows = table.querySelectorAll("tr");
    rows.forEach(function(row, rowIndex) {
        var rowData = [];
        
        // Проходимо по кожній клітинці, але ігноруємо останні два стовпці
        row.querySelectorAll("td, th").forEach(function(cell, cellIndex) {
            var totalColumns = row.querySelectorAll("td, th").length;
            if (cellIndex < totalColumns - 1 && rowIndex > 1) { // Ігноруємо останні 2 стовпці і перші 2 рядки
                rowData.push(cell.innerText);
            }
        });
        
        // Додаємо рядок у масив даних
        if (rowData.length > 0) {
            data.push(rowData);
        }
    });
    
    // Створюємо книгу та лист
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(data);

    // Встановлюємо ширину стовпців
    setColumnWidths(ws);

    // Робимо перший рядок жирним
    setBoldFirstRow(ws);

    // Додаємо лист у книгу
    XLSX.utils.book_append_sheet(wb, ws, "Дані повірки");

    // Генеруємо файл Excel
    XLSX.writeFile(wb, "Тестметрстандарт_лічильники_води.xlsx");
}

