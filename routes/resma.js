var express = require('express');
var router = express.Router();
var restrict = require('../services/restrict');

var Order = require('../models/order');

var BreakfastItem = require('../models/breakfastitem');
var LunchItem = require('../models/lunchitem');
var DinnerItem = require('../models/dinneritem');
var Cart = require('../models/cartitem');

var MenuService = require('../services/menu-service');
var OrdersService = require('../services/order-service');
var UserService = require('../services/user-service');
var TableService = require('../services/table-service');


//HOME
router.get('/home', restrict, function(req, res, next) {
    //res.io.emit("socketToMe", "users");

    var currOrders = [];
    var user = req.user._id;
    var orderCountOnsite = 0;
    var orderCountOnline = 0;
    var orderCountDelivered = 0;

    if (req.user.user_type == 'manager'){
        OrdersService.getOrders(function(err, orders) {
            if (err) {
                console.log(err);
                res.render('auth/login',{});
            }else{
                OrdersService.setDate(function (date) {
                    if(date != null){
                        orderCountOnsite = date.order_count_onsite;
                        orderCountOnline = date.order_count_online;
                        orderCountDelivered = date.order_count_delivered;
                    }
                    res.render('resma/home', {
                        orders: orders.reverse().slice(0,10),
                        isHomeRouteOn : true,
                        orderCountOnsite: orderCountOnsite,
                        orderCountOnline: orderCountOnline,
                        orderCountDelivered: orderCountDelivered,
                        helpers: {
                            ifCond: function (v1, v2, options) {
                                if (v1 == v2) {
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

            res.render('resma/home', {
                orders: currUserOrders.reverse().slice(0,10),
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
    }else{
        res.render('resma/home', {
            //orders: currUserOrders,
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
                                items: itemsAll,
                                user_type: req.user.user_type,
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
                orders: orders.reverse()
            });
        }
    });
});

router.get('/orders/new-order-init', restrict, function (req, res) {

    var dayInfo = OrdersService.getDayInfo();
    var type = 'onsite';
    var availableTables = [];

    OrdersService.getOrders(function (err, orders){
        if(err){
            console.log(err);
        }else{
            TableService.getTableView(function (err, tableCount) {
                if(err){
                    console.log(err);
                }else{
                    var tablesCount = tableCount[0].table_num -1;

                    for(a=1;a<=tablesCount;a++){
                        availableTables.push(a);
                    }

                    for(j=1;j<=tablesCount;j++){
                        for(i=0;i<orders.length;i++){
                            if(orders[i].table_no == j && orders[i].order_state != 'finished' ){
                                for(x=0;x<availableTables.length;x++){
                                    if(availableTables[x]==j){
                                        delete availableTables[x];
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    OrdersService.getCurrentCount(type, function (currOrderCount) {
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
                                    layout: 'new-order.html',
                                    availableTables : availableTables
                                });
                            }
                        });
                    });
                }
            });
        }
    });

});

router.post('/orders/:id/new-order', restrict, function (req, res, next) {
    console.log('Req' + req.body);

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
                    var type = 'onsite';
                    OrdersService.setOrderStat(stat, type, function(err){
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
    var status = 'delivered';
    OrdersService.setOrderStatus(req.params.id, status, function (err) {
        if(err){
            console.log(err);
            res.send(err);
        }else{
            OrdersService.getOrderStat(function (err, stat) {
                if (err) {
                    console.log(err);
                } else {
                    var type = 'delivered';
                    OrdersService.setOrderStat(stat, type, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/resma/kitchen');
                        }
                    });
                }
            });
        }
    });
});

router.get('/order/:id/finished', restrict, function (req, res) {
    var status = 'finished';
    OrdersService.setOrderStatus(req.params.id, status, function (err) {
        if(err){
            console.log(err);
        }else{

            OrdersService.getOrderDetails(req.params.id, function(err, orderDetails) {
                if (err){
                    console.log(err);
                }else{
                    res.render('resma/print-invoice',{
                        order_details : orderDetails,
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

router.get('/addtocart/:section/:id', function (req, res) {
    var itemToGet = req.params.id;
    var Section;

    if (req.params.section == "Breakfast"){
        Section = BreakfastItem;
    }else if (req.params.section == "Lunch"){
        Section = LunchItem;
    }else if (req.params.section == "Dinner"){
        Section = DinnerItem;
    }

    MenuService.getItemToCartById(Section, itemToGet, function (err, item) {
        if(err){
            console.log(err);
        }else{
            console.log("Items" + item);
            OrdersService.addItemToCart(item, function (err) {
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/resma/menus');
                }
            });
        }
    });
});

router.get('/removefromcart/:id', function (req, res) {
    var item = req.params.id;
    console.log("Items" + item);
    OrdersService.removeItemFromCart(item, function (err) {
        if(err){
            console.log(err);
        }else{
            res.redirect('/resma/menus');
        }
    });
});

router.get('/mini-cart', function (req, res) {
    OrdersService.getItems(Cart, function (err, items) {
        if(err){
            console.log(err);
        }else{
            var grand_total=0;
            for(var i=0;i<items.length;i++){
                grand_total += parseInt(items[i].item_price);
            }
            res.render('resma/orders', {
                cart_items: items,
                total: grand_total,
                layout: 'cart.html'
            });
        }
    });
});

router.get('/cart/remove', function (req, res) {
    OrdersService.clearCart(function (err) {
        if(err){
            console.log(err);
        }else{
            res.redirect('/resma/menus');
        }
    });
});

router.get('/cart/new-order/:id', function (req, res) {
    OrdersService.addNewOnlineOrder(req.params.id, function (err) {
        OrdersService.getOrderStat(function (err, stat) {
            if (err){
                console.log(err);
                res.send(err);
            }else{
                var type = 'online';
                OrdersService.setOrderStat(stat, type, function(err){
                    if (err) {
                        console.log(err);
                    }else{
                        res.render('resma/home', {
                            message: 'Thank You for ordering! Your Order will be ready in 30 mins'
                        });
                    }
                });
            }
        });
    });
});

router.get('/ordercount', function(req, res){
    var orderCountOnsite = 0;
    var orderCountOnline = 0;
    var orderCountDelivered = 0;

    OrdersService.setDate(function (date) {
        if(date != null){
            orderCountOnsite = date.order_count_onsite;
            orderCountOnline = date.order_count_online;
            orderCountDelivered = date.order_count_delivered;
        }
        res.send({
            orderCountOnsite: orderCountOnsite,
            orderCountOnline: orderCountOnline,
            orderCountDelivered: orderCountDelivered
        });

    });
});


module.exports = router;
