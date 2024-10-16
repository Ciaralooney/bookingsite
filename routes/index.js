var express = require('express');
var indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Workshop Bookings' });
});

module.exports = indexRouter;
