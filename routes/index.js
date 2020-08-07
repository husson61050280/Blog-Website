var express = require('express');
var router = express.Router();

// import blog
var BlogModel  = require('../model/BlogModel');
var Blog = new BlogModel();


/* GET home page. */
router.get('/', function(req, res, next) {

  Blog.NewArrival(function(err,Blog){
    if (err) throw err;
    res.render('index', {Blogs : Blog});
  });
});

module.exports = router;
