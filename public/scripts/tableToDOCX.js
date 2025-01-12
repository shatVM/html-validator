document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('export-docx-btn').addEventListener('click', function() {
      var table = document.querySelector('.rotated-table');

      // Створюємо новий масив даних, починаючи з третього рядка
      var tableRows = Array.from(table.rows).slice(2); // ігноруємо перші два рядки (заголовки таблиці)
      
      // Використовуємо бібліотеку docx для створення документа
      const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } = docx;

      const doc = new Document();
      
      const rows = tableRows.map(row => {
        const cells = Array.from(row.cells).map(cell => new TableCell({
          children: [new Paragraph(cell.innerText)],
        }));
        return new TableRow({ children: cells });
      });

      const tableDocx = new Table({
        rows: rows,
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      });

      doc.addSection({
        children: [tableDocx],
      });

      Packer.toBlob(doc).then(blob => {
        saveAs(blob, "table_data.docx");
      });
    });
  });