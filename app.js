var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const flash = require("connect-flash");

//import Router
var indexRouter = require("./routes/index");
var BlogRouter = require("./routes/Blog");
var UserRouter = require("./routes/User");

//Upload File or Image
var multer = require("multer");
var upload = multer({ dest: "./public/images" });

var app = express();

//session
var session = require("express-session");

//session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

//passport
var passport = require("passport");
//เช็คจากฐานข้อมูล
var LocalStrategy = require("passport-local").Strategy;
app.use(passport.initialize());
app.use(passport.session());

//express message
app.use(function (req, res, next) {
  res.locals.message = require("express-messages")(req, res);
  next();
});

//สร้างตัว User ให้เป็น Local
app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//import database connectDB
var mongodb = require("mongodb");
var db = require("monk")(
  "mongodb://heroku_9k21qtdq:m28uq165q6oas1j9gktrsfh0f8@ds123311.mlab.com:23311/heroku_9k21qtdq"
);

//ใช้งาน Router
app.use("/", indexRouter);
app.use("/Blog", BlogRouter);
app.use("/User", UserRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//ตัดข้อความแสดงผลหน้าเว็บให้สั้นลง
app.locals.descriptionText = function (text, length) {
  return text.substring(0, length);
};

//set port
const port = process.env.PORT || 3000;
// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

module.exports = app;
