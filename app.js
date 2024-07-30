var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
// var logger = require('morgan');

var indexRouter = require("./src/routes");
// var usersRouter = require("./routes/users");
var expressLayouts = require("express-ejs-layouts");
var app = express();
const mongoose = require("mongoose");
const ConnectDB = require("./src/apps/init_main_db");

// view engine setup
app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "admin");
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

ConnectDB.connection();
app.use("/", indexRouter);
// app.use("/users", usersRouter);
// loc:3000/item/user/demo
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
