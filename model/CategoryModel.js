//import database connectDB
var mongodb = require("mongodb");
// var db = require("monk")("mongodb://heroku_m18k90bt:mb8nu695rnnfkvr9vmamratd6k@ds235243.mlab.com:35243/heroku_m18k90bt");
// var db = require("monk")("localhost:27017/BlogWeb")
var db = require("monk")("mongodb+srv://new-user-01:1234@cluster0.vowzx.mongodb.net/BlogWeb?retryWrites=true&w=majority")

var categories = db.get("categories");

class Category {

  constructor(title) {
    this.title = title;
  }
  
  //ดึงข้อมูล Category
  findCategories(callback) {
    categories.find({}, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //findByCategorytitle
  Categorytitle(title, callback) {
    console.log(title);
    categories.find({ title: title }, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }
}


module.exports = Category;
