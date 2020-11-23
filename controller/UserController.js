var express = require("express");
var router = express.Router();

//model
var UserModel = require("../model/UserModel");
var User = new UserModel();

//randomstring
const randomstring = require("randomstring");

//nodemailer
const nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport({     
//   host: 'smtp.gmail.com',     
//   port: 465,     
//   secure: true,     
//   auth: {         
//      type: 'OAuth2',         
//      user: 'blogse.project@gmail.com',         
//      accessToken: "ya29.a0AfH6SMBLXBNw8x368liMKC7E5XQ89JGvDg7d-NtYIuNAVPyBPoI9sDtx8dzQZZMhEO7548xgdlw7UYZ7xDfeS3OAmLjwcNUhMtHxNjn7Q_-LKktrDcnc3-_ocd15GcseSCp-M1WWcv4a_IE1_H_8yCmQDRFkZ2XqQXCJkJpPxwg"    
//   } 
// });
// outlook
const transporter = nodemailer.createTransport({     
  service: 'hotmail',
  auth: {
    user: 'blogse.Project@outlook.co.th', // your email
    pass: 'husson9032543' // your email password
  }
});

class UserController {
  // login page
  Login_Page(req, res) {
    res.render("Login");
  }
  // signup page
  Signup_Page(req, res) {
    res.render("Register");
  }
  // บันทึกข้อมูล User
  AddUser(req, res) {
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

            const html = `Hi there, <br/> 
                  Thank you for registing! 
                  <br/> <br/> 
                  Please verify your email by typing the following Token <br/> 
                  Token : <b>${secret_token}</b>
                  <br/> 
                  Thank you sir!`;

            // setup email data with unicode symbols
            const mailOptions = {
              from: "blogse.Project@outlook.co.th", // sender
              to: email, // list of receivers
              subject: "Verify Email BlogSE",
              html: html, // HTML body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (err, info) {
              if (err) console.log(err);
              else console.log(info);
            });

            res.redirect("/User/SignIn");
          }
        });
      });
    }
  }
  //logout
  Logout(req, res) {
    req.logout();
    res.redirect("/Blog");
  }
  //ViewProfile
  ViewProfile(req, res) {
    let user_id = req.params.id
    User.getUserById(user_id, function (err, users) {
      if (err) throw err;
      res.render("ViewProfile", { users: users, user: req.user });
    });
  }
  //editProfile
  EditProfile(req, res) {
    let user_id = req.params.id
    User.getUserById(user_id, function (err, users) {
      if (err) throw err;
      res.render("editProfile", { users: users, user: req.user });
    });
  }
  // UpdateProfile
  UpdateProfile(req, res) {
    let user_id = req.params.id;
    let firstname = req.body.first_name;
    let lastname = req.body.last_name;
    var User = new UserModel("", " ", firstname, lastname);
    User.UpdateProfile(user_id, function (err, success) {
      if (err) throw err;
    });
    res.location("/Blog");
    res.redirect("/Blog");
  }
  // Vertify
  Vertify_User(req, res) {
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
  }
  // forget Password Page
  ForgetPassword_Page(req,res){
    res.render("forgotPassword.ejs");
  }   
  // forget Password
  ForgetPassword(req, res) {
    let email = req.body.email;
    User.CheckEmail(email, function (err, success) {
      console.log("User", success);
      if (success == 0) {
        let errors = "Email Not Found. Please Try again"
        res.render("/User/forgotPassword" , {errors : errors});
      }
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

          // setup email data with unicode symbols
          const mailOptions = {
            from: "blogse.Project@outlook.co.th", // sender
            to: email, // list of receivers
            subject: "Forgot Password BlogSE",
            html: html, // HTML body
          };

          // send mail with defined transport object
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err);
            else console.log(info);
          });
          res.redirect("/User/NewPassword");
        });
      }
    });
  }
  // New Pssword Page
  NewPassword_Page(req,res){
    res.render("newPassword.ejs");
  }  
  // New Password Commit
  NewPassword(req,res){
    let email = req.body.email;
    let key = req.body.key;
    key = key.trim();
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
  }   

} //class

module.exports = UserController;
