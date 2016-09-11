var express = require('express');
var router = express.Router();
var restrict = require('../services/restrict');

var Order = require('../models/order');

var BreakfastItem = require('../models/breakfastitem');
var LunchItem = require('../models/lunchitem');
var DinnerItem = require('../models/dinneritem');

var MenuService = require('../services/menu-service');
var OrdersService = require('../services/order-service');
var UserService = require('../services/user-service');


//HOME
router.get('/home', restrict, function(req, res, next) {
    //res.io.emit("socketToMe", "users");

    var currOrders = [];
    var user = req.user._id;

    if (req.user.user_type == 'manager'){
        OrdersService.getOrders(function(err, orders) {
            if (err) {
                console.lgo(err);
                res.render('auth/login',{});
            }else{
                OrdersService.setDate(function () {
                    console.log('Got Date Stat');
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
            }
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
router.get('/orders', restrict, function (req, res, next) {
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

router.get('/orders/new-order-init', restrict, function (req, res) {

    var dayInfo = OrdersService.getDayInfo();

    OrdersService.getCurrentCount(function (currOrderCount) {
        console.log(currOrderCount);
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
                    currOrderId: currOrderCount,
                    layout: 'new-order.html'
                });
            }
        });
    });
});

router.post('/orders/:id/new-order', restrict, function (req, res, next) {

    console.log('Order item qty ' + JSON.stringify(req.body));

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

router.get('/orders/details/:id', restrict, function (req, res, next) {
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

router.get('/orders/details/kitchen/:id', restrict, function (req, res, next) {
    OrdersService.getOrderDetails(req.params.id, function(err, orderDetails) {
        if (err){
            console.log(err);
        }else{
            res.render('resma/orders-kitchen', {
                order_details : orderDetails,
                kitchen:true,
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

router.get('/user/:id/account-settings', restrict, function (req, res) {
    UserService.getUserById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('/resma/home');
        }else{
            res.render('resma/user-account.html', {user:user});
        }
    });
});

router.get('/order/:id/process', restrict, function (req, res) {
    var status = 'process';
    OrdersService.setOrderStatus(req.params.id, status, function (err) {
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.redirect('/resma/home');
        }
    });
});

router.get('/order/:id/deliver', restrict, function (req, res) {
    var status = 'deliver';
    OrdersService.setOrderStatus(req.params.id, status, function (err) {
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.redirect('/resma/home');
        }
    });
});

router.get('/kitchen', function (req, res) {
    OrdersService.getOrdersForKitchen(function (err,orders) {
        if (err){
            console.log(err);
            res.render('resma/home');
        }else{
            res.render('resma/orders-kitchen', {
                orders: orders,
                auth: 'kitchen'
            });
        }
    });
});

module.exports = router;
