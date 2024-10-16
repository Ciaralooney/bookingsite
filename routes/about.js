var express = require('express');
var aboutRouter = express.Router();

aboutRouter.get('/', (req, res, next) => {
  res.render('about', { title: 'About Us' });
});

module.exports = aboutRouter;