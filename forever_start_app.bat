@echo off
iisreset /stop
cd /d C:\xampp\htdocs\water-server
start cmd /k forever start app.js