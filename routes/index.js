var express = require('express');
var router = express.Router();

var IndexInfoService = require('../services/index-info-service');


/* GET resma page. */
router.get('/', function(req, res, next) {
    IndexInfoService.getIndexInfo(function (err, info) {
        if (err) {
            console.log(err);
            res.send(err);
        }else{
            console.log(info);
            res.render('index', {
                title: 'Resma',
                info: info,
                landing: true,
                manager_auth: true
            });
        }
    });
});

/* GET resma page. */
router.get('/waiter', function(req, res, next) {
    res.render('index-waiter', {
        title: 'Resma',
        landing: true,
        waiter_auth: true
    });
});

/* GET resma page. */
router.get('/customer', function(req, res, next) {
    res.render('index-customer', {
        title: 'Resma',
        landing: true,
        cust_auth: true
    });
});

router.get('/info/:id', function(req, res, next) {
    IndexInfoService.getCategoryInfo([req.params.id], function (err, info) {
        if (err) {
            console.log(err);
            res.send(err);
        }else{
            res.render('category-info', {
                title: info.category,
                info: info
            });
        }
    });
});

//router.get('/get-started', function (req, res, next) {
//    res.render('index',{
//        categorySelect: true
//    });
//});

module.exports = router;
