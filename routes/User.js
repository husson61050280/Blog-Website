var express = require("express");
var router = express.Router();

// import Controller
var UserController = require("../controller/UserController");
var UserCon = new UserController();

//model
var UserModel = require("../model/UserModel");
var User = new UserModel();

//login
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

//login page
router.get("/SignIn", UserCon.Login_Page);

//signUp page
router.get("/SignUp", UserCon.Signup_Page);

//บันทึก User
router.post("/Register", UserCon.AddUser);

//เช็ค Login
router.post(
  "/SignIn",
  passport.authenticate("local", {
    //login ไม่สำเร็จ
    failureRedirect: "/User/SignIn",
    failureFlash: true,
    errors = "Username or Password Wrong!"
  }),

  // login สมบูรณ์
  (req, res) => {
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
router.get("/Signout", UserCon.Logout);

//ViewProfile
router.get("/ViewProfile/:id", UserCon.ViewProfile);

//editProfile
router.get("/EditProfile/:id", UserCon.EditProfile);

//Update Profile
router.post("/UpdateProfile/:id", UserCon.UpdateProfile);

//Verifly
router.post("/Verifly", UserCon.Vertify_User);

//forgot Password Page
router.get("/forgotPassword", UserCon.ForgetPassword_Page);

//forgot Password
router.post("/forgotPassword", UserCon.ForgetPassword);

//User NewPassword
router.get("/NewPassword", UserCon.NewPassword_Page);

//User NewPassword
router.post("/NewPassword", UserCon.NewPassword);

module.exports = router;
