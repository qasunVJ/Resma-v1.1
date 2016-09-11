var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var multer = require('multer');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/resma');
var db = mongoose.connection;
async = require('async');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var resma = require('./routes/resma');
var managers = require('./routes/managers');
var waiters = require('./routes/waiters');

var passportConfig = require('./services/passport-conf');
passportConfig();

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
handlebars = exphbs.create({
    defaultLayout: 'layout',
    extname      : '.html',
    partialsDir: [
        'views/partials/'
    ]
});

app.engine('html', handlebars.engine);
app.set('view engine', 'html');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Connect Flash
app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


//Global Variables
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
    console.log(res.locals.messages());

  if (req.url == '/' || req.url == '/signup'){
    res.locals.isLogged = false
  }
  next();
});

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    if (req.user){
        res.locals.usertype = req.user.user_type;
    }
    if (req.user && req.user.user_type == 'manager'){
        res.locals.manager = true;
    }
    if (req.user && req.user.user_type == 'waiter'){
        res.locals.waiter = true;
    }
    if (req.user && req.user.user_type == 'customer'){
        res.locals.customer = true;
    }
    next();
});

app.use('/', routes);
app.use('/auth', auth);
app.use('/resma', resma);
app.use('/managers', managers);
app.use('/waiters', waiters);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// ERROR HANDLERS

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {app: app, server: server};
