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
const { text } = require("express");
const { check } = require("express-validator");

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
    let page = req.query.page;
    let limit = 9;
    if (isNaN(page)) {
      page = 1;
      limit = 9;
    }
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    console.log(startIndex);
    console.log(endIndex);

    Blog.findblog((err, blog) => {
      if (err) throw err;
      Categories.findCategories((err, categories) => {
        if (err) throw err;
        var number_page = Object.keys(blog).length / limit;
        number_page = Math.ceil(number_page);
        console.log(page);
        res.render("Blog", {
          blogs: blog.slice(startIndex, endIndex),
          categories: categories,
          moment: moment,
          number_page: number_page,
          page: page,
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
    let page = req.query.page;
    let limit = 10;
    if (isNaN(page)) {
      page = 1;
      limit = 10;
    }
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    let user_id = req.params.id;
    Blog.findMyBlog(user_id, (err, blog) => {
      if (err) throw err;
      var number_page = Object.keys(blog).length / limit;
      number_page = Math.ceil(number_page);
      console.log(page);
      Categories.findCategories((err, categories) => {
        if (err) throw err;
        res.render("Myblog", {
          blogs: blog.slice(startIndex, endIndex),
          categories: categories,
          users: req.user,
          number_page: number_page,
          page: page,
          check: "My",
        });
      });
    });
  }
  //แสดง Blog ตามประเภท Blog เช่น Education , Technology
  GroupByCategory(req, res) {
    let page = req.query.page;
    let limit = 10;
    if (isNaN(page)) {
      page = 1;
      limit = 10;
    }
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    let title = req.params.title;
    Blog.GroupByCategories(title, function (err, blog) {
      if (err) throw err;
      var number_page = Object.keys(blog).length / limit;
      number_page = Math.ceil(number_page);
      console.log(page);
      Categories.Categorytitle(title, function (err, catTitle) {
        if (err) throw err;
        Categories.findCategories(function (err, categories) {
          if (err) throw err;
          res.render("BlogByCat", {
            blogs: blog.slice(startIndex, endIndex),
            category: catTitle,
            categories: categories,
            moment: moment,
            number_page: number_page,
            page: page,
            title: title,
          });
        });
      });
    });
  }
  // แสดง Blog ตามประเภท Blog เช่น Education , Technology ในหน้า MyBlog (หน้า Blog ที่ User เป็นคนเขียน)
  GroupByCategory_User(req, res) {
    let page = req.query.page;
    let limit = 10;
    if (isNaN(page)) {
      page = 1;
      limit = 10;
    }
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    let title = req.params.title;
    let userid = req.params.id;
    Blog.GroupByCategoriesByUser(title, userid, function (err, blog) {
      if (err) throw err;
      var number_page = Object.keys(blog).length / limit;
      number_page = Math.ceil(number_page);
      console.log(page);
      Categories.Categorytitle(title, function (err, catTitle) {
        if (err) throw err;
        Categories.findCategories(function (err, categories) {
          if (err) throw err;
          console.log("CatTitle = " , catTitle);
          console.log("CatTitle = " , catTitle.title);
          res.render("Myblog", {
            blogs: blog.slice(startIndex, endIndex),
            category: catTitle,
            categories: categories,
            moment: moment,
            users: req.user,
            page: page,
            number_page: number_page,
            check: "cat"
          });
        });
      });
    });
  }
  //เนื้อหาบทความ
  BlogDetail(req, res) {
    let Blog_id = req.params.id;
    Blog.findblogbyId(Blog_id, function (err, blog) {
      if (err) throw err;
      Categories.findCategories(function (err, categories) {
        if (err) throw err;
        Blog.CountView(Blog_id, function (err, success) {
          if (err) throw err;
          res.render("BlogDetail", { blogs: blog, categories: categories });
        });
      });
    });
  }
  //หน้าแก้ไขบทความ
  EditBlog(req, res) {
    let Blog_id = req.params.id;
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
    let Blog_id = req.params.id;
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
  DeleteBlog(req, res) {
    let Blog_id = req.params.id;
    Blog.DeleteBlog(Blog_id, function (err, success) {
      if (err) throw err;
    });
    res.location("/Blog");
    res.redirect("/Blog");
  }
} //class

module.exports = BlogController;
