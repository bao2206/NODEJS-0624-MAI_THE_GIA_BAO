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
var session = require("express-session");
var flash = require("connect-flash");
// view engine setup
app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "yourSecret", // Chuỗi bí mật dùng để ký session ID cookie
    resave: false, // Không lưu session nếu không có sự thay đổi
    saveUninitialized: true, // Lưu session mới ngay cả khi nó chưa được khởi tạo
    cookie: { secure: false }, // Đặt secure là true nếu bạn đang sử dụng HTTPS
  })
);

app.use(expressLayouts);
app.use((req, res, next) => {
  if (req.url.startsWith("/admin")) {
    app.set("layout", "admin");
  } else {
    app.set("layout", "frontend");
  }
  next();
});
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
// Middleware to make flash messages available in all views
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("successMessage");
  res.locals.errorMessage = req.flash("errorMessage");
  next();
});
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
