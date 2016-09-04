var express = require('express');
var router = express.Router();
var restrict = require('../services/restrict');

var Order = require('../models/order');

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
    MenuService.getItem(function (err, items) {
        if (err) {
            console.log(err);
            res.send(err);
        }else{
            res.render('menus/menus', {
                title: 'Resma | Menus',
                items: items
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
            res.render('resma/home', {
                order_type: 'onsite',
                date: dayInfo.date,
                time: dayInfo.time,
                state: 'on-creating',
                currOrderId: currOrderId,
                layout: 'new-order.html'
            });
        }
    });
});

router.post('/orders/new-order', function (req, res, next) {

    var dayInfo = OrdersService.getDayInfo();

    var itemCount = req.body.item_count;
    var orderItem = req.body.order_item;
    var orderItemQty = req.body.order_item_qty;
    var order_items=[];

    //Iterating through all the items in the order
    for (var i=0; i<itemCount; i++){
        console.log(i);
        var item = {
            item_name : orderItem[i],
            item_qty : orderItemQty[i]
        };

        order_items.push(item);
    }

    console.log(order_items);

    var order = new Order({
        order_type: 'on-site',
        order_date: dayInfo.date,
        order_time: dayInfo.time,
        delivered_time: dayInfo.time,
        order_state: 'created',
        table_no: req.body.table_no,
        waiter_id: req.body.waiter_id,
        customer_name: req.body.customer_name,
        items: order_items
    });

    console.log('Order item qty ' + JSON.stringify(order));

    OrdersService.createNewOrder(order, function(err){
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
