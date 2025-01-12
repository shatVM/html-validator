// Файл з конфігурацією Handlebars
const hbs = require('hbs');

// Хелпер для абсолютного шляху
hbs.registerHelper('absolutePath', function(path) {
  return '/' + path;
});