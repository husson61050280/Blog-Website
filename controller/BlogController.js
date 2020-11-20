var express = require("express");
var router = express.Router();

// import blog
var BlogModel = require("../model/BlogModel");
var Blog = new BlogModel();

//import Category
var Category = require("../model/CategoryModel");
var Categories = new Category();

//SetDate
var moment = require("moment");

class BlogController {
    
  //เช็ค login
  enSureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/User/SignIn");
    }
  }
  //Blog ใหม่ล่าสุด แสดงหน้า Landing page
  NewArrival(req, res) {
    Blog.NewArrival((err, Blog) => {
      if (err) throw err;
      res.render("index", { Blogs: Blog });
    });
  }

  // QuryBlog
  GetBlog(req, res) {
    Blog.findblog((err, blog) => {
      if (err) throw err;
      Categories.findCategories((err, categories) => {
        if (err) throw err;
        res.render("Blog", {
          blogs: blog,
          categories: categories,
          moment: moment,
        });
      });
    });
  }
  //หน้าเขียนบทความ
  AddBlog(req, res) {
    Categories.findCategories((err, categories) => {
      if (err) throw err;
      res.render("addBlog", {
        categories: categories,
        users: req.user,
      });
    });
  }
  //เพื่มบทความ
  AddBlog_Post(req, res) {
    const { title, content, img, author } = req.body;
    let errors = [];
    if (!title || !content || !img || !author) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (errors.length > 0) {
      Categories.findCategories((err, categories) => {
        res.render("Register", {
          categories: categories,
          errors: errors,
        });
      });
    } else {
      //บันทึกข้อมูล
      let title = req.body.title;
      let content = req.body.content;
      let img = req.body.img;
      let author = req.body.author;
      let category = req.body.category;
      let date = new Date();
      let Userid = req.body.Userid;
      let views = 0;

      var Blog = new BlogModel(
        title,
        content,
        img,
        author,
        category,
        date,
        Userid,
        views
      );

      Blog.AddBlog(function (err, success) {
        if (err) throw err;
      });
      res.redirect("/Blog");
    }
  }
  //แสดงหน้า Blog ของตัวเอง
  Myblog(req, res) {
    let user_id = req.params.id
    Blog.findMyBlog(user_id, (err, blog) => {
      if (err) throw err;
      Categories.findCategories((err, categories) => {
        if (err) throw err;
        res.render("Myblog", {
          blogs: blog,
          categories: categories,
          users: req.user,
        });
      });
    });
  }
  //แสดง Blog ตามประเภท Blog เช่น Education , Technology
  GroupByCategory(req, res) {
    let title = req.params.title;
    Blog.GroupByCategories(title, function (err, blog) {
      if (err) throw err;
      Categories.Categorytitle(title, function (err, catTitle) {
        if (err) throw err;
        Categories.findCategories(function (err, categories) {
          if (err) throw err;
          res.render("BlogByCat", {
            blogs: blog,
            category: catTitle,
            categories: categories,
            moment: moment,
          });
        });
      });
    });
  }
  // แสดง Blog ตามประเภท Blog เช่น Education , Technology ในหน้า MyBlog (หน้า Blog ที่ User เป็นคนเขียน)
  GroupByCategory_User(req, res) {
    let title = req.params.title
    let userid = req.params.id;
    Blog.GroupByCategoriesByUser(title, userid, function (err, blog) {
      if (err) throw err;
      Categories.Categorytitle(title, function (err, catTitle) {
        if (err) throw err;
        Categories.findCategories(function (err, categories) {
          if (err) throw err;
          res.render("Myblog", {
            blogs: blog,
            category: catTitle,
            categories: categories,
            moment: moment,
            users: req.user,
          });
        });
      });
    });
  }
  //เนื้อหาบทความ
  BlogDetail(req, res) {
    let Blog_id = req.params.id
    Blog.findblogbyId(Blog_id, function (err, blog) {
      if (err) throw err;
      Categories.findCategories(function (err, categories) {
        if (err) throw err;
        Blog.CountView(Blog_id, function (err, success) {
          if (err) throw err;
          res.render("BlogDetail", { blogs: blog, categories: categories});
        });
      });
    });
  }
  //หน้าแก้ไขบทความ
  EditBlog(req, res) {
    let Blog_id = req.params.id
    Blog.findblogbyId(Blog_id, function (err, blog) {
      if (err) throw err;
      Categories.findCategories(function (err, categories) {
        if (err) throw err;
        res.render("editBlog", {
          blogs: blog,
          users: req.user,
          categories: categories,
        });
      });
    });
  }
  //บันทึกการแก้ไขบทความ
  EditBlog_Post(req, res) {
    let Blog_id = req.params.id
    //edit data
    let title = req.body.title;
    let content = req.body.content;
    let img = req.body.img;
    let author = req.body.author;
    let category = req.body.category;
    var Blog = new BlogModel(title, content, img, author, category);
    Blog.UpdateBlog(Blog_id, function (err, success) {
      if (err) throw err;
    });
    res.location("/Blog");
    res.redirect("/Blog");
  }  
  //ลบ Blog
  DeleteBlog(req,res) {
    let Blog_id = req.params.id
    Blog.DeleteBlog(Blog_id, function (err, success) {
        if (err) throw err;
      });
      res.location("/Blog");
      res.redirect("/Blog");
  }   


} //class

module.exports = BlogController;
