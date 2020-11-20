var express = require("express");
var router = express.Router();

// import Controller
var BlogController = require("../controller/BlogController");
var BlogCon = new BlogController();

// แสดง Blog ที่หน้าแรกของเว็บ
router.get("/", BlogCon.GetBlog);

//หน้าเขียนบทความ
router.get("/addBlog", BlogCon.AddBlog);

//เพิ่มบทความ
router.post("/addBlog", BlogCon.AddBlog_Post);

//myBlog
router.get("/Myblog/:id", BlogCon.Myblog);

//GroupByCategory
router.get("/GroupByCategory/:title", BlogCon.GroupByCategory);

//GroupByCategory By User
router.get("/GroupByCategory/:title/:id", BlogCon.GroupByCategory_User);

//BlogDetail
router.get("/detail/:id", BlogCon.BlogDetail);

//EditBlog Page
router.get("/Edit/:id", BlogCon.EditBlog);

router.post("/Edit/:id", BlogCon.EditBlog_Post);

//delete Blog
router.get("/Delete/:id", BlogCon.DeleteBlog);

module.exports = router;
