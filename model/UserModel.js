//import database connectDB
var mongodb = require("mongodb");
var db = require("monk")("mongodb://heroku_m18k90bt:mb8nu695rnnfkvr9vmamratd6k@ds235243.mlab.com:35243/heroku_m18k90bt");

//เข้ารหัส
var bcrypt = require("bcryptjs");

//Global Connect Database
var User = db.get("User");

class UserModel {

  //Add User
  AddUser(Userdata, callback) {
    console.log(Userdata);
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(Userdata["password"], salt, function (err, hash) {
        Userdata["password"] = hash;
        User.insert(
          {
            username: Userdata["username"],
            password: Userdata["password"],
            first_name: Userdata["firstname"],
            last_name: Userdata["lastname"],
            email: Userdata["email"],
          },
          function (err, success) {
            if (err) throw err;
          }
        );
      });
    });
  }

  //ตรวจสอบการ login
  getUserById(id, callback) {
    User.find({ _id: id }, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //Query Username
  getUserByUserName(username2, callback) {
    User.findOne({ username: username2 }, {}, function (err, result) {
      if (err) throw err;
      console.log(result);
      callback(null, result);
    });
  }

  //เปรียบเทียบรหัสผ่าน
  comparePassword(password, hash, callback) {
    bcrypt.compare(password, hash, function (err, isMatch) {
      callback(null, isMatch);
    });
  }

  //เช็ค email ซ้ำไหม
  CheckEmail(email, callback) {
    User.findOne({ email: email }, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //UpdateProfile
  UpdateProfile(id, userdata, callback) {
    User.update(
      {
        _id: id,
      },
      {
        $set: {
          username: userdata["username"],
          first_name: userdata["firstname"],
          last_name: userdata["lastname"],
        },
      },
      function (err, success) {
        if (err) {
          res.send(err);
        } else {
          callback(null, success);
        }
      }
    );
  }
} // class

module.exports = UserModel;
