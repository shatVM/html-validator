document.addEventListener('DOMContentLoaded', function () {
  const tableButton = document.getElementById('export-xlsx-btn')
  if (tableButton) {
    tableButton.addEventListener('click', function () {
      // exportTableToExcel()
      tableToExcel()
    })
  }

  //
  const tableButtonAdmin = document.getElementById('export-xlsx-btn-admin')
  if (tableButtonAdmin) {
    tableButtonAdmin.addEventListener('click', function () {
      tableToExcel()
    })
  }
});






function exportTableToExcel() {
  var table = document.querySelector('.rotated-table');
  var tableRows = Array.from(table.rows).slice(2); // ігноруємо перші два рядки (заголовки таблиці)
  console.log(tableRows)
  var newTable = createNewTable(tableRows);

  var wb = XLSX.utils.table_to_book(newTable, { sheet: "Дані повірки" });
  var ws = wb.Sheets["Дані повірки"];

  setColumnWidths(ws);
  applyCustomFormatting(ws);

  var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  saveExcelFile(wbout);
}

function createNewTable(tableRows) {
  var newTable = document.createElement('table');
  tableRows.forEach(function (row) {
    newTable.appendChild(row.cloneNode(true));
  });
  return newTable;
}


function applyCustomFormatting(ws) {
  var range = XLSX.utils.decode_range(ws['!ref']);
  for (var R = range.s.r; R <= range.e.r; ++R) {
    for (var C = range.s.c; C <= range.e.c; ++C) {
      var cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
      if (!cell) continue;
      //if (C === 2 || C === 6 || C === 8) 
      //{ // Установлюємо текстовий формат для стовпця
      cell.z = '@'; // формат як текст
      console.log("Збережено комірку як текстову")
      //}
    }
  }

  // Застосовуємо блакитну заливку та жирний шрифт для першого рядка
  for (var C = range.s.c; C <= range.e.c; ++C) {
    var headerCell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
    if (headerCell) {
      headerCell.s = {
        fill: {
          patternType: "solid",
          fgColor: { rgb: "ADD8E6" }
        },
        font: {
          bold: true
        }
      };
    }
  }
}



function saveExcelFile(wbout) {
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'Тестметрстандарт_лічильники_води.xlsx');
}

