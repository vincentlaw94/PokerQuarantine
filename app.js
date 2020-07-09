var createError = require("http-errors");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var keys = require("./config/keys");
var passport = require("passport");
var cookieSession = require("cookie-session");

// connect to mongoDB
mongoose.connect(keys.mongoURI);
// import models
require("./models/User");
require("./models/Creditcards");
require("./models/NewsPosts");

var app = express();

//use cookie session for user login, store cookie for 31 days
app.use(
  cookieSession({ maxAge: 31 * 24 * 60 * 60 * 1000, keys: [keys.cookieKey] })
);

// passport setup
require("./services/passport");
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));

//routes
var authRouter = require("./routes/authRoutes");
var indexRouter = require("./routes/indexRoutes");
app.use('/', indexRouter);
app.use('/api', authRouter);
// require("./routes/newsRoutes")(app); (dont use this format, cant compile on heroku)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;