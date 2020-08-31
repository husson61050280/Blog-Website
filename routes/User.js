var express = require("express");
var router = express.Router();

//model
var UserModel = require("../model/UserModel");
var User = new UserModel();

//login
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

//validator
const { check, validationResult } = require("express-validator");

//randomstring
const randomstring = require("randomstring");

//mailer
const mailer = require("./Mailer");

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
      }
      User.CheckUsername(username, function (err, success) {
        console.log("User", success);
        if (success) {
          errors.push({ msg: "Username already exists" });
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
          let username = req.body.username;
          let password = req.body.password;
          let firstname = req.body.firstname;
          let lastname = req.body.lastname;
          let email = req.body.email;
          //randomstring
          let secret_token = randomstring.generate();
          //status of Verifly
          let active = false;

          var User = new UserModel(
            username,
            password,
            firstname,
            lastname,
            email,
            secret_token,
            active
          );
          User.AddUser(function (err, user) {
            if (err) throw err;
          });

          //compose an email
          const html = `Hi there, <br/> 
        Thank you for registing! 
        <br/> <br/> 
        Please verify your email by typing the following Token <br/> 
        Token : <b>${secret_token}</b>
        <br/> 
        Thank you sir!`;

          mailer.sendEmail(
            "admin@BlogKmitl.com",
            email,
            "Please Verify you email!",
            html
          );

          res.redirect("/User/SignIn");
        }
      });
    });
  }
});

//forgot password

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
    let users = req.user;
    //check verifly
    if (!users.active) {
      res.render("Verifly", { users: users });
    } else {
      res.redirect("/Blog");
    }
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
      User.comparePassword(password, user.password, function (err, isMatch) {
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
  let id = req.params.id;
  User.getUserById(id, function (err, users) {
    if (err) throw err;
    res.render("ViewProfile", { users: users, user: req.user });
  });
});

//editProfile
router.get("/EditProfile/:id", function (req, res, next) {
  let id = req.params.id;
  User.getUserById(id, function (err, users) {
    if (err) throw err;
    res.render("editProfile", { users: users, user: req.user });
  });
});

//Update Profile
router.post("/UpdateProfile/:id", function (req, res, next) {
  let id = req.params.id;
  let firstname = req.body.first_name;
  let lastname = req.body.last_name;

  var User = new UserModel("", " ", firstname, lastname);
  User.UpdateProfile(id, function (err, success) {
    if (err) throw err;
  });
  res.location("/Blog");
  res.redirect("/Blog");
});

//Verifly
router.post("/Verifly", function (req, res, next) {
  let secret_token = req.body.secret_token;
  let user_secret_token = req.body.user_secret_token;
  let userId = req.body.userid;
  console.log(user_secret_token);
  console.log(secret_token);

  //CheckSecretKey
  if (user_secret_token == secret_token) {
    User.SetActive(userId, function (err, success) {
      if (err) throw err;
      res.redirect("/Blog");
    });
  } else {
    res.redirect("/User/SignIn");
  }
});

//forgot Password
router.get("/forgotPassword", function (req, res, next) {
  res.render("forgotPassword.ejs");
});

//forgot Password
router.post("/forgotPassword", function (req, res, next) {
  let email = req.body.email;
  User.CheckEmail(email, function (err, success) {
    console.log("User", success);
    if (success) {
      User.getUserByEmail(email, function (err, result) {
        let secret_token = result[0].secret_token;
        console.log("GetUSer by email = ", result);
        //compose an email
        const html = `Hi there, <br/> 
        Email : ${email} 
        <br/> <br/> 
        Please copy verify code and enter to website<br/> 
        Token : <b>${secret_token}</b>
        Thank you sir!`;

        mailer.sendEmail(
          "admin@BlogKmitl.com",
          email,
          "Forgot password!",
          html
        );
        res.redirect("/User/NewPassword");
      });
    }
  });
});

//User NewPassword
router.get("/NewPassword", function (req, res, next) {
  res.render("newPassword.ejs");
});

//User NewPassword
router.post("/NewPassword", function (req, res, next) {
  let email = req.body.email;
  let key = req.body.key;
  key = key.trim()
  let password = req.body.password;

  User.getUserByEmail(email, function (err, result) {
    let secret_token = result[0].secret_token;
    let id = result[0]._id;
    if (key == secret_token) {
      User.UpdatePassword(id, password, function (err, result) {
        if (err) throw err;
      });
      res.redirect("/User/SignIn");
    } else {
      console.log("Error");
    }
  });
});

module.exports = router;
