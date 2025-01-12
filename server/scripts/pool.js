const mysql = require('mysql2')

const pool = mysql.createPool({
    host:'localhost',
    //host:'193.107.75.5',
   	
    //host:'10.15.131.218',
    
    user:'root',
    database: 'water_result',
    password:''
})
 
module.exports = pool