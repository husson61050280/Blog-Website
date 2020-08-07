var express = require("express");
var router = express.Router();

//model
var UserModel = require('../model/UserModel')
var User = new UserModel();

//login
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

//validator
const { check, validationResult } = require("express-validator");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("ฺBlog");
});

//login page
router.get("/SignIn", function (req, res, next) {
  res.render("Login");
});

//signUp page
router.get("/SignUp", function (req, res, next) {
  res.render("Register");
});

//บันทึก User
router.post("/Register", function (req, res, next) {
  const {
    firstname,
    lastname,
    email,
    username,
    password,
    password2,
  } = req.body;
  let errors = [];

  if (
    !firstname ||
    !lastname ||
    !username ||
    !email ||
    !password ||
    !password2
  ) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("Register", {
      errors,
      firstname,
      lastname,
      username,
      email,
      password,
      password2,
    });
  } else {
    User.CheckEmail(email, function (err, success) {
      console.log("User", success);
      if (success) {
        errors.push({ msg: "Email already exists" });
        res.render("Register", {
          errors,
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      } else {
        //complete insert to database
        Userdata = [];
        (Userdata["username"] = req.body.username),
          (Userdata["password"] = req.body.password),
          (Userdata["firstname"] = req.body.firstname),
          (Userdata["lastname"] = req.body.lastname),
          (Userdata["email"] = req.body.email);

          User.AddUser(Userdata, function (err, user) {
          if (err) throw err;
        });
        res.redirect("/User/SignIn");
      }
    });
  }
});

//เช็ค Login

router.post(
  "/SignIn",
  passport.authenticate("local", {
    //login ไม่สำเร็จ
    failureRedirect: "/User/SignIn",
    failureFlash: true,

  }),

  // login สมบูรณ์
  function (req, res) {
    res.redirect("/Blog");
  }
);


passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.getUserByUserName(username, function (err, user) {
      if (err) throw err;
      console.log(user);
      if (!user) {
        return done(null, false);
      }
      User.comparePassword(password, user.password, function (
        err,
        isMatch
      ) {
        if (err) throw err;
        console.log(isMatch);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  })
);

//logout
router.get("/Signout", function (req, res, next) {
  req.logout();
  res.redirect("/Blog");
});

//ViewProfile
router.get("/ViewProfile/:id", function (req, res, next) {
  id = req.params.id;
  User.getUserById(id, function (err, users) {
    if (err) throw err;
    res.render("ViewProfile", { users: users, user: req.user });
  });
});

//editProfile
router.get("/EditProfile/:id", function (req, res, next) {
  id = req.params.id;
  User.getUserById(id, function (err, users) {
    if (err) throw err;
    res.render("editProfile", { users: users, user: req.user });
  });
});

//Update Profile
router.post("/UpdateProfile/:id", function (req, res, next) {
  id = req.params.id;
  Userdata = [];
  (Userdata["username"] = req.body.username),
    (Userdata["firstname"] = req.body.first_name),
    (Userdata["lastname"] = req.body.last_name);

    User.UpdateProfile(id, Userdata, function (err, success) {
    if (err) throw err;
  });
  res.location("/Blog");
  res.redirect("/Blog");
});

module.exports = router;
