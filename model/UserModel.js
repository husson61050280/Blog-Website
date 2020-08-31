//import database connectDB
var mongodb = require("mongodb");
var db = require("monk")("mongodb://heroku_m18k90bt:mb8nu695rnnfkvr9vmamratd6k@ds235243.mlab.com:35243/heroku_m18k90bt");
// var db = require("monk")("localhost:27017/BlogWeb");

//เข้ารหัส
var bcrypt = require("bcryptjs");

//Global Connect Database
var User = db.get("User");

class UserModel {
  constructor(
    username,
    password,
    first_name,
    last_name,
    email,
    secret_token,
    active
  ) {
    this.username = username;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.secret_token = secret_token;
    this.active = active;
  }

  //Add User
  AddUser(callback) {
    let username = this.username;
    let password = this.password;
    let first_name = this.first_name;
    let last_name = this.last_name;
    let email = this.email;
    let secret_token = this.secret_token;
    let active = this.active;

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        password = hash;
        User.insert(
          {
            username: username,
            password: password,
            first_name: first_name,
            last_name: last_name,
            email: email,
            secret_token: secret_token,
            active: active,
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

  getUserByEmail(email, callback) {
    User.find({ email: email }, {}, function (err, result) {
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

  //เช็ค username ซ้ำไหม
  CheckUsername(username, callback) {
    User.findOne({ username: username }, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //เช็ค email ซ้ำไหม
  CheckEmail(email, callback) {
    User.findOne({ email: email }, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //set Active
  SetActive(userId, callback) {
    let active = !this.active;
    User.update(
      {
        _id: userId,
      },
      {
        $set: {
          active: active,
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

  //อัพเดท password

  //UpdateProfile
  UpdateProfile(id, callback) {
    let first_name = this.first_name;
    let last_name = this.last_name;

    console.log(first_name);
    console.log(last_name);

    User.update(
      {
        _id: id,
      },
      {
        $set: {
          first_name: first_name,
          last_name: last_name,
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

  UpdatePassword(id, password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        password = hash;

        User.update(
          {
            _id: id,
          },
          {
            $set: {
              password: password,
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
      });
    });
  }
} // class

module.exports = UserModel;
