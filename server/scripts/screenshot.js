const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

const pdfPath = '../../public/uploads/7673927.pdf';
const outputPath = '../../public/uploads/screenshot.png';
const coordinates = { left: 100, top: 100, width: 200, height: 200 };

(async () => {
  try {
    // Read the PDF file
    const pdfData = await fs.promises.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfData);
    const firstPage = pdfDoc.getPages()[0];

    // Render PDF page as an image using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(`
      <html>
        <head><style>* { margin: 0; padding: 0; }</style></head>
        <body>
          <img src="data:image/png;base64,${await firstPage
            .toPng()
            .then((data) => data.toString('base64'))}" />
        </body>
      </html>
    `);

    // Take screenshot
    const screenshotBuffer = await page.screenshot({ encoding: 'binary' });
    await browser.close();

    // Process screenshot with Sharp (crop and save)
    await sharp(screenshotBuffer)
      .extract({
        left: coordinates.left,
        top: coordinates.top,
        width: coordinates.width,
        height: coordinates.height,
      })
      .toFile(outputPath);

    console.log('Screenshot saved:', outputPath);
  } catch (err) {
    console.error('Error processing PDF or image:', err);
  }
})();
