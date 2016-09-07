var express = require('express');
var router = express.Router();
var restrict = require('../services/restrict');

var Order = require('../models/order');

var BreakfastItem = require('../models/breakfastitem');
var LunchItem = require('../models/lunchitem');
var DinnerItem = require('../models/dinneritem');

var MenuService = require('../services/menu-service');
var OrdersService = require('../services/order-service');


//HOME
router.get('/home', function(req, res, next) {
    var currOrders = [];

    OrdersService.getOrders(function (err,orders) {
        currOrders = orders;
        console.log(currOrders);

        res.render('resma/home', {
            orders: currOrders,
            firstName: req.user ? req.user.firstName : null
        });
    });
});

//MENUS
router.get('/menus', restrict, function(req, res, next) {
    var itemsAll;
    var breakfast_items;
    var lunch_items;
    var dinner_items;

    MenuService.getItems(BreakfastItem, function (err, breakfastItems) {
        if (err) {
            console.log(err);
            res.send(err);
        }else{
            breakfast_items = breakfastItems;
            MenuService.getItems(LunchItem, function (err, lunchItems) {
                if (err){
                    console.log(err);
                    res.send(err);
                }else{
                    lunch_items = lunchItems;
                    MenuService.getItems(DinnerItem, function (err, dinnerItems) {
                        if (err){
                            console.log(err);
                            res.send(err);
                        }else{
                            dinner_items = dinnerItems;

                            itemsAll = {
                                lunch_items: lunch_items,
                                breakfast_items: breakfast_items,
                                dinner_items: dinner_items
                            };
                            console.log(itemsAll);

                            res.render('menus/menus', {
                                title: 'Resma | Menus',
                                items: itemsAll
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/orders', function (req, res, next) {
    OrdersService.getOrders(function (err,orders) {
        if (err){
            console.log(err);
            res.render('resma/home');
        }else{
            res.render('resma/orders', {
                orders: orders
            });
        }
    });
});

router.get('/orders/new-order-init', function (req, res) {

    var dayInfo = OrdersService.getDayInfo();

    OrdersService.getCurrentOrderId(function (err, currOrderId) {
        if (err) {
            console.log(err);
        }else{
            OrdersService.getItemsForOrder(function (err, items) {
                if (err) {
                    console.log(err);
                }else{
                    res.render('resma/home', {
                        orderItems: items,
                        order_type: 'onsite',
                        date: dayInfo.date,
                        time: dayInfo.time,
                        state: 'on-creating',
                        currOrderId: currOrderId,
                        layout: 'new-order.html'
                    });
                }
            });
        }
    });
});

router.post('/orders/:id/new-order', function (req, res, next) {

    //console.log('Order item qty ' + JSON.stringify(order));

    OrdersService.createNewOrder(req, function(err){
        if (err){
            console.log(err);
            res.send(err);
        }else{
            OrdersService.getOrderStat(function (err, stat) {
                if (err) throw err;
                console.log(stat);

                OrdersService.setOrderStat(stat, function(err){
                    if (err) {
                        console.log(err);
                    }else{
                        res.render('resma/home',{});
                    }
                });
            });
        }
    });
});

module.exports = router;
