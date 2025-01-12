module.exports = (req, res, next) => {
    if (req.session.isAdmin) {
      // Якщо користувач є адміністратором, дозволяємо доступ
      next();
    } else {
      // Якщо користувач не є адміністратором, перенаправляємо його на сторінку помилки або головну сторінку
      console.log('Спроба відкрити маршрут без прав Адміністратора')
      res.redirect('/');
    }
  };
  