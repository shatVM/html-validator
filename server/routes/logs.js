const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
const { getFormattedDateTime, getFormattedDate } = require("../scripts/getFormattedDateTime")

router.get("/", function (req, res) {

    const text_info = [1, 'Відображення логів сервера'];
    console.log(text_info);
    

    const logsDirectory = path.join('server', 'scripts', 'logger', 'logs');

    //console.log('logsDirectory ', logsDirectory)
    fs.readdir(logsDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const txtFiles = files.filter(file => path.extname(file) === '.txt');
        const fileContents = txtFiles.map(file => {
            const filePath = path.join(logsDirectory, file);
            return {
                filename: file,
                content: fs.readFileSync(filePath, 'utf8')
            };
        });

        res.render('../views/logs.hbs', {

            
            info:text_info,
            results: fileContents ,
        })

    });

})

module.exports = router
