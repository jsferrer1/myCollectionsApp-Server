var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
var cors = require('cors');
var fileUpload = require('./public/javascripts/fileupload');

// connect to the mongoDB database

mongoose.connect(process.env.MYCOLLECTIONSDBPROD || config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});

// setup routers
//var routes = require('./routes/index');
var users = require('./routes/users');
var collectionRouter = require('./routes/collectionRouter');
var fileRouter = require('./routes/fileRouter');

var app = express();

app.use(cors());

// Secure traffic only
//app.all('*', function(req, res, next){
//  console.log('req start: ', req.method, req.secure, req.hostname, req.url, app.get('port'));
//  if (req.secure) {
      // BEGIN - Enable CORS
      // See: http://stackoverflow.com/q/23823010/1288109
      /*
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, x-access-token");
      res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, x-access-token, Accepted");
      res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Credentials", true);
      */
      // END
//      return next();
//  };

//  res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
//});

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// initialize passport
app.use(passport.initialize());

//app.use('/', routes);
app.use('/users', users);
app.use('/collections', collectionRouter);
app.use('/upload', fileRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
