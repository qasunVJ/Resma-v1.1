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
    var user = req.user._id;

    if (req.user.user_type == 'manager'){
        OrdersService.getOrders(function(err, orders) {
            res.render('resma/home', {
                orders: orders,
                firstName: req.user ? req.user.firstName : null,
                helpers: {
                    ifCond : function(v1, v2, options) {
                        if(v1 == v2) {
                            return options.fn(this);
                        }
                        return options.inverse(this);
                    }
                }
            });
        });
    }else if (req.user.user_type == 'waiter'){
        OrdersService.getUserOrders(user, function(err, thisUser) {
            var currUserOrders = thisUser;
            console.log('Curr ORders' + currUserOrders);

            res.render('resma/home', {
                orders: currUserOrders,
                firstName: req.user ? req.user.firstName : null,
                helpers: {
                    ifCond : function(v1, v2, options) {
                        if(v1 == v2) {
                            return options.fn(this);
                        }
                        return options.inverse(this);
                    }
                }
            });
        });
    }
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


//All Orders
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
                if (err){
                    console.log(err);
                    res.send(err);
                }else{
                    OrdersService.setOrderStat(stat, function(err){
                        if (err) {
                            console.log(err);
                        }else{
                            res.redirect('/resma/home');
                        }
                    });
                }
            });
        }
    });
});

router.get('/orders/details/:id', function (req, res, next) {
    OrdersService.getOrderDetails(req.params.id, function(err, orderDetails) {
        if (err){
            console.log(err);
        }else{
            res.render('resma/resma-settings', {
                order_details : orderDetails,
                layout: 'order-details-layout.html',
                helpers: {
                    ifCond : function(v1, v2, options) {
                        if(v1 == v2) {
                            return options.fn(this);
                        }
                        return options.inverse(this);
                    }
                }
            });
        }
    });
});

module.exports = router;
