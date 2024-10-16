var express = require('express');
var workshopRouter = express.Router();

workshopRouter.get('/', (req, res, next) => {
  res.render('workshops', { title: 'Scheduled Workshops' });
});

module.exports = workshopRouter;