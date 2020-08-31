//import database connectDB
var mongodb = require("mongodb");
var db = require("monk")("mongodb://heroku_m18k90bt:mb8nu695rnnfkvr9vmamratd6k@ds235243.mlab.com:35243/heroku_m18k90bt");
// var db = require("monk")("localhost:27017/BlogWeb")

//Global Connect Database
var blogs = db.get("Blogs");

//SetDate
var moment = require("moment");

class BlogModel {
  constructor(title, content, img, author, category, date, Userid,views) {
    this.title = title;
    this.content = content;
    this.img = img;
    this.author = author;
    this.category = category;
    this.date = date;
    this.Userid = Userid;
    this.views = views;
  }

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

  //Add blog
  AddBlog(callback) {
    let title = this.title;
    let content = this.content;
    let img = this.img;
    let author = this.author;
    let category = this.category;
    let date = this.date;
    let Userid = this.Userid;
    let views = this.views;
    blogs.insert({
      title: title,
      content: content,
      img: img,
      author: author,
      category: category,
      date: date,
      Userid: Userid,
      views: this.views,
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

  //Update Editblog
  UpdateBlog(id, callback) {
    console.log(id);
    let title = this.title;
    let content = this.content;
    let img = this.img;
    let author = this.author;
    let category = this.category;
    blogs.update(
      {
        _id: id,
      },
      {
        $set: {
          title: title,
          content: content,
          img: img,
          author: author,
          category: category,
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


  CountView(id, callback) {
    blogs.find ({ _id: id }, {}, function (err, result) {
      if (err) throw err;
      let views = result[0].views
  
    console.log(id);
    blogs.update(
      {
        _id: id,
      },
      {
        $set: {
          views : views+1
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
    })
  }


} //class

module.exports = BlogModel;
