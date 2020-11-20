var express = require('express');
var router = express.Router();

// import Controller 
var BlogController = require("../controller/BlogController");
var BlogCon = new BlogController();

/* GET home page. */
router.get('/', BlogCon.NewArrival)

module.exports = router;
