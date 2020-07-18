var express = require("express");
var router = express.Router();
var blogModel = require("../model/BlogModel");
var UserModel = require("../model/UserModel");

//check Validator
var { check, validationResult } = require("express-validator");

//SetDate
var moment = require("moment");

// //Upload File or Image
// var multer = require("multer");

// //ตั้งค่าการบันทึกรูปลงใน ฐานข้อมูล โดยชื่อรูป ตั้งจากเวลาที่ทำการ upload
// var storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "./public/images/");
//   },
//   filename: function (req, file, callback) {
//     callback(null, Date.now() + ".jpg");
//   },
// });

// var upload = multer({
//   storage: storage,
// });

//เช็ค login
function enSureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/User/SignIn");
  }
}

router.get("/", function (req, res, next) {
  blogModel.findblog(function (err, blog) {
    if (err) throw err;
    blogModel.findCategories(function (err, categories) {
      if (err) throw err;
      res.render("Blog", {
        blogs: blog,
        categories: categories,
        moment: moment,
      });
    });
  });
});

//หน้าเขียนบทความ
router.get("/addBlog", function (req, res, next) {
  blogModel.findCategories(function (err, categories) {
    if (err) throw err;
    res.render("addBlog", {
      categories: categories,
      users: req.user,
    });
  });
});

//เพิ่มบทความ
router.post(
  "/addBlog",
  [
    check("title", "Please Fill in Title").not().isEmpty(),
    check("content", "Please Fill in Content").not().isEmpty(),
    check("img", "Please Fill in Image").not().isEmpty(),
    check("author", "Please Fill in Author_Name").not().isEmpty(),
  ],
  function (req, res, next) {
    var result = validationResult(req);
    var errors = result.errors;

    if (!result.isEmpty()) {
      blogModel.findCategories(function (err, categories) {
        res.render("addBlog", {
          categories: categories,
          errors: errors,
        });
      });
    }
    //บันทึกข้อมูล
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.img);
    blogdata = [];
    (blogdata["title"] = req.body.title),
      (blogdata["content"] = req.body.content),
      (blogdata["img"] = req.body.img),
      (blogdata["author"] = req.body.author),
      (blogdata["category"] = req.body.category),
      (blogdata["date"] = new Date()),
      (blogdata["Userid"] = req.body.Userid);
    console.log(blogdata);

    blogModel.AddBlog(blogdata, function (err, success) {
      if (err) throw err;
    });
    res.redirect("/Blog");
  }
);

//myBlog
router.get("/Myblog/:id", function (req, res, next) {
  id = req.params.id;
  blogModel.findMyBlog(id, function (err, blog) {
    if (err) throw err;
    blogModel.findCategories(function (err, categories) {
      if (err) throw err;
      res.render("Myblog", {
        blogs: blog,
        categories: categories,
        users: req.user,
      });
    });
  });
});

//GroupByCategory
router.get("/GroupByCategory/:title", function (req, res, next) {
  title = req.params.title;
  blogModel.GroupByCategories(title, function (err, blog) {
    if (err) throw err;
    blogModel.Categorytitle(title, function (err, catTitle) {
      if (err) throw err;
      blogModel.findCategories(function (err, categories) {
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
});

//GroupByCategory By User
router.get("/GroupByCategory/:title/:id", function (req, res, next) {
  userid = req.params.id;
  title = req.params.title;
  blogModel.GroupByCategoriesByUser(title, userid, function (err, blog) {
    if (err) throw err;
    blogModel.Categorytitle(title, function (err, catTitle) {
      if (err) throw err;
      blogModel.findCategories(function (err, categories) {
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
});

//BlogDetail
router.get("/detail/:id", function (req, res, next) {
  id = req.params.id;
  blogModel.findblogbyId(id, function (err, blog) {
    if (err) throw err;
    blogModel.findCategories(function (err, categories) {
      if (err) throw err;
      res.render("BlogDetail", { blogs: blog, categories: categories });
    });
  });
});

//EditBlog Page
router.get("/Edit/:id", function (req, res, next) {
  id = req.params.id;
  blogModel.findblogbyId(id, function (err, blog) {
    if (err) throw err;
    blogModel.findCategories(function (err, categories) {
      if (err) throw err;
      res.render("editBlog", {
        blogs: blog,
        users: req.user,
        categories: categories,
      });
    });
  });
});

// //EditBlog Update กรณีอัปโหลดรูป

// router.post("/Edit/:id", upload.single("img") , function (req, res, next) {
//   id = req.params.id;
//   users = req.user;

//   //แก้ไข และ Upload รูปภาพ
//   if (req.file) {
//     var projectImage = req.file.filename;
//     let check = true
//     blogdata = [];
//     (blogdata["title"] = req.body.title),
//       (blogdata["content"] = req.body.content),
//       (blogdata["img"] = projectImage),
//       (blogdata["author"] = req.body.author),
//       (blogdata["category"] = req.body.category),
//       (blogdata["date"] = new Date()),
//       (blogdata["Userid"] = req.body.Userid);
//     blogModel.UpdateBlog(blogdata, id , check , function(err,success){
//       if (err) throw err;
//     });
//     res.location("/Blog");
//     res.redirect("/Blog");
//   }

//   //ไม่มีการอัปโหลดรูป
//   else {
//     let check = false
//     blogdata = [];
//     (blogdata["title"] = req.body.title),
//       (blogdata["content"] = req.body.content),
//       (blogdata["author"] = req.body.author),
//       (blogdata["category"] = req.body.category),
//       (blogdata["date"] = new Date()),
//       (blogdata["Userid"] = req.body.Userid);
//     console.log(blogdata);
//     blogModel.UpdateBlog(blogdata, id, check,  function (err, success) {
//       if (err) throw err;
//     });
//     res.location("/Blog");
//     res.redirect("/Blog");
//   }
// });


//EditBlog Update

router.post("/Edit/:id", function (req, res, next) {
  id = req.params.id;
  users = req.user;
  let blogdata = []
  blogdata["title"] = req.body.title,
  blogdata["content"] = req.body.content,
  blogdata["img"] = req.body.img,
  blogdata["author"] = req.body.author,
  blogdata["category"] = req.body.category,
  blogdata["date"] = new Date(),
  blogdata["Userid"] = req.body.Userid;
  console.log(blogdata);
  blogModel.UpdateBlog(blogdata, id, function (err, success) {
    if (err) throw err;
  });
  res.location("/Blog");
  res.redirect("/Blog");
});


//delete Blog
router.get("/Delete/:id", function (req, res, next) {
  id = req.params.id;
  blogModel.DeleteBlog(id, function (err, success) {
    if (err) throw err;
  });
  res.location("/Blog");
  res.redirect("/Blog");
});

module.exports = router;
