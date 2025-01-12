const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 8080;

// Middleware для парсингу JSON та URL-закодованих даних
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Налаштування сесій
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Головна сторінка
app.get('/', (req, res) => {
  if (req.session.isAuthenticated) {
    res.send(`
      <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
          }
          form {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f5f5f5;
          }
          label {
            margin-bottom: 10px;
          }
          input {
            margin-bottom: 20px;
            padding: 5px;
            width: 200px;
          }
          button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>Hello, ${req.session.username}!</h1>
        <form action="/logout" method="post">
          <button type="submit">Logout</button>
        </form>
      </body>
      </html>
    `);
  } else {
    res.send(`
      <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
          }
          form {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f5f5f5;
          }
          label {
            margin-bottom: 10px;
          }
          input {
            margin-bottom: 20px;
            padding: 5px;
            width: 200px;
          }
          button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <form action="/login" method="post">
          <div>
            <label>Username:</label>
            <input type="text" name="username" required>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" required>
          </div>
          <button type="submit">Login</button>
        </form>
      </body>
      </html>
    `);
  }
});

// Обробка логіна
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Простий приклад перевірки логіна
  if (username === 'user' && password === 'password') {
    req.session.isAuthenticated = true;
    req.session.username = username;
    res.redirect('/');
  } else {
    res.send('Invalid username or password. Please <a href="/">try again</a>.');
  }
});

// Обробка логаута
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error logging out.');
    }
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

