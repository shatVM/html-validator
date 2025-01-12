const express = require('express')
const router = express.Router()
const {getFormattedDateTime, getFormattedDate} = require("../scripts/getFormattedDateTime")



router.get("/", function (req, res) {
 
    const text_info = [1, 'Система перегляду результатів Повірки законодавчо регульованих засобів вимірювальної техніки, що перебувають в експлуатації'];
    console.log(text_info);
    
    res.render('../views/index.hbs', {
        results: 'index',
        info: text_info,
    })
})

module.exports = router
