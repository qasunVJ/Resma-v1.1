var express = require('express');
var router = express.Router();
var OrdersService = require('../services/order-service');

//Single User Orders
router.get('/:id/orders', function (req, res, next) {
    OrdersService.getUserOrders(req.user.id, function(err, userOrders) {
        if (err){
            console.log(err);
            res.render('resma/home');
        }else{
            res.render('resma/orders', {
                orders: userOrders.orders
            });
        }
    });
});

module.exports = router;