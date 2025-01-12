const express = require('express')
const router = express.Router()
const {getFormattedDateTime, getFormattedDate} = require("../scripts/getFormattedDateTime")

router.get("/", function (req, res) {
 
    const text_info = [1, 'Система перевірки сайтів'];
    console.log(text_info);
    
    res.render('../views/index.hbs', {
        results: 'index',
        info: text_info,
    })
})

module.exports = router
