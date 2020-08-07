//import database connectDB
var mongodb = require("mongodb");
var db = require("monk")("mongodb://heroku_m18k90bt:mb8nu695rnnfkvr9vmamratd6k@ds235243.mlab.com:35243/heroku_m18k90bt");

//Global Connect Database
var blogs = db.get("Blogs");
var categories = db.get("categories");

//SetDate
var moment = require("moment");

class BlogModel {
  constructor() {}

  //ดึงข้อมูล Blogs
  findblog(callback) {
    blogs.find({}, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //ดึงข้อมูล Blogs by id
  findblogbyId(id, callback) {
    blogs.find({ _id: id }, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //ดึงข้อมูล Category
  findCategories(callback) {
    categories.find({}, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //Add blog
  AddBlog(Blogdata, callback) {
    console.log(Blogdata);
    blogs.insert({
      title: blogdata["title"],
      content: blogdata["content"],
      img: blogdata["img"],
      author: blogdata["author"],
      category: blogdata["category"],
      date: blogdata["date"],
      Userid: blogdata["Userid"],
    }),
      function (err, success) {
        if (err) throw err;
        else {
          callback(null, success);
        }
      };
  }

  //findMyblog
  findMyBlog(id, callback) {
    console.log(id);
    blogs.find({ Userid: id }, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //find Blog ByCategory
  GroupByCategories(title, callback) {
    console.log(title);
    blogs.find({ category: title }, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //findByCategory By User
  GroupByCategoriesByUser(title, id, callback) {
    console.log(title);
    blogs.find({ category: title, Userid: id }, {}, function (err, result) {
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

  //Update Editblog
  UpdateBlog(blogdata, id, callback) {
    console.log(blogdata);
    console.log(id);
    blogs.update(
      {
        _id: id,
      },
      {
        $set: {
          title: blogdata["title"],
          content: blogdata["content"],
          img: blogdata["img"],
          author: blogdata["author"],
          category: blogdata["category"],
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

  //delete Blog
  DeleteBlog(id, callback) {
    console.log(id);
    blogs.remove({ _id: id }, {}, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }

  //New Arrival
  NewArrival(callback) {
    blogs.find({}, { sort: { date: -1 }, limit: 3 }, function (err, blog) {
      if (err) throw err;
      callback(null, blog);
    });
  }
} //class

module.exports = BlogModel;
