//import database connectDB
var mongodb = require("mongodb");
var db = require("monk")("mongodb://heroku_m18k90bt:mb8nu695rnnfkvr9vmamratd6k@ds235243.mlab.com:35243/heroku_m18k90bt");


//Global Connect Database
var blogs = db.get("Blogs");
var categories = db.get("categories");

//SetDate
var moment = require("moment");

//ดึงข้อมูล Blogs
module.exports.findblog = function (callback) {
  blogs.find({}, {}, function (err, result) {
    if (err) throw err;
    callback(null, result);
  });
};

//ดึงข้อมูล Blogs by id
module.exports.findblogbyId = function (id, callback) {
  blogs.find({ _id: id }, {}, function (err, result) {
    if (err) throw err;
    callback(null, result);
  });
};

//ดึงข้อมูล Category
module.exports.findCategories = function (callback) {
  categories.find({}, {}, function (err, result) {
    if (err) throw err;
    callback(null, result);
  });
};

//addBlog
module.exports.AddBlog = function (Blogdata, callback) {
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
};

//findMyblog
module.exports.findMyBlog = function (id, callback) {
  console.log(id);
  blogs.find({ Userid: id }, {}, function (err, result) {
    if (err) throw err;
    callback(null, result);
  });
};

//findByCategory
module.exports.GroupByCategories = function (title, callback) {
  console.log(title);
  blogs.find({ category: title }, {}, function (err, result) {
    if (err) throw err;
    callback(null, result);
  });
};

//findByCategory By User
module.exports.GroupByCategoriesByUser = function (title, id, callback) {
  console.log(title);
  blogs.find({ category: title, Userid: id }, {}, function (err, result) {
    if (err) throw err;
    callback(null, result);
  });
};

//findByCategorytitle
module.exports.Categorytitle = function (title, callback) {
  console.log(title);
  categories.find({ title: title }, {}, function (err, result) {
    if (err) throw err;
    callback(null, result);
  });
};

//Update Editblog
module.exports.UpdateBlog = function (blogdata, id, callback) {
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
module.exports.DeleteBlog = function (id, callback) {
  console.log(id);
  blogs.remove({ _id: id }, {}, function (err, result) {
    if (err) throw err;
    callback(null, result);
  });
};

//New Arrival
module.exports.NewArrival = function (callback) {
  blogs.find({}, { sort: { date: -1 }, limit: 3 }, function (err, blog) {
    if (err) throw err;
    callback(null, blog);
  });
};
