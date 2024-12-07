var createError = require("http-errors");
var express = require("express");
const session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
// var logger = require('morgan');
var flash = require('express-flash')
var indexRouter = require("./src/routes");
// var usersRouter = require("./routes/users");
var expressLayouts = require("express-ejs-layouts");
// var session = require("express-session");
// var flash = require("connect-flash");
const mongoose = require("mongoose");
const ConnectDB = require("./src/apps/init_main_db");


var app = express();
// view engine setup
app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "your-secret-key", // Chuỗi bí mật dùng để ký session ID cookie
    saveUninitialized: true, // Lưu session mới ngay cả khi nó chưa được khởi tạo
    resave: false,
    cookie: { secure: false }
  })
);
app.use(flash());

app.use(expressLayouts);

app.set("layout", "admin");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Middleware to make flash messages available in all views

ConnectDB.connection();

app.use("/", indexRouter);
// app.use("/users", usersRouter);
// loc:3000/item/user/demo
// catch 404 and forward to error handler


app.use(function (req, res, next) {
  next(createError(404));
});
// app.use((req, res, next) => {
//   res.locals.user = req.cookies.user || null;
//   next(); 
// })
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
