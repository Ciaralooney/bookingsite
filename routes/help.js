var express = require('express');
var helpRouter = express.Router();

helpRouter.get('/', (req, res, next) => {
  res.render('help', { title: 'Frequently Asked Questions' });
});

module.exports = helpRouter;