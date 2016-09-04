var express = require('express');
var router = express.Router();


//Menus
router.get('/home', function(req, res, next) {
    res.render('resma/home');
});

module.exports = router;
