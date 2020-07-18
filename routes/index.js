var express = require('express');
var router = express.Router();
var blogModel = require("../model/BlogModel");


/* GET home page. */
router.get('/', function(req, res, next) {

  blogModel.NewArrival(function(err,Blog){
    if (err) throw err;
    res.render('index', {Blogs : Blog});
  });
});

module.exports = router;
