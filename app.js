var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// logs info about request method, status code, and response time
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var bookingRouter = require('./routes/bookings');
var workshopRouter = require('./routes/workshop');
var aboutRouter = require('./routes/about');
var helpRouter = require('./routes/help');

// connecting to the mongo server
const url = 'mongodb://127.0.0.1:27017/workshop';

const options = {
  useNewUrlParser: true,       // Stops the string parser deprecation warning
  useUnifiedTopology: true,   // Stops the the server discovery and monitoring engine deprecation warning
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Connect to MongoDB using Mongoose
mongoose.connect(url, options)
  .then(() => {
    console.log(' Successfully connected to server');
  })
  .catch((error) => {
    console.error('Error connecting to server:', error);
  });

// creating a new Express application instance called app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // all ejs views will be in views directory
app.set('view engine', 'ejs'); // specifying the view engine in the express app

app.use(logger('dev'));  // log http requests
app.use(express.json());  // using json library 
app.use(express.urlencoded({ extended: false })); // parses incoming URL-encoded form data 
app.use(cookieParser());    // parse HTTP request cookies and make them available as a JavaScript object
app.use(express.static(path.join(__dirname, 'public')));  // if displaying a file it will be in public folder

// these are found in the roots folder since they handle a url, these are get methods
app.use('/', indexRouter);
app.use('/bookings', bookingRouter);
app.use('/workshops', workshopRouter);
app.use('/about', aboutRouter);
app.use('/help', helpRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  // render the error page
  res.status(err.status || 500);
  res.render('error');  // render the file in this location
});

// exporting the app object to make it available in other files 
module.exports = app;