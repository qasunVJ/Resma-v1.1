var Order = require('../models/order');
var NewOrder = require('../models/new-order');
var DateOnsiteOrder = require('../models/dateorderonsite');
var BreakfastItems = require('../models/breakfastitem');
var LunchItems = require('../models/lunchitem');
var DinnerItems = require('../models/dinneritem');
var Waiters = require('../models/waiter');
var User = require('../models/user');
var Cart = require('../models/cartitem');
var UserService = require('../services/user-service');


//Set Date
module.exports.setDate = function (callback) {
    var today = new Date();

    var date = today.getDate().toString();
    var month = today.getMonth().toString();
    var year = today.getFullYear().toString();

    var todayString = date + '.' + month + '.' + year;

    DateOnsiteOrder.findOne({date: todayString}, function (err, date) {
        if(err){
            console.log(err);
        }else{
            if (date == null){

                var Today = new DateOnsiteOrder({
                    date: todayString,
                    order_count_onsite:0,
                    order_count_online:0,
                    order_count_delivered:0
                });

                Today.save(callback(date));
            }else{
                callback(date);
            }
        }
    });
};


//Get Orders
module.exports.getOrders = function (callback) {
    Order.find(callback);
};

//Get Orders
module.exports.getOrdersForKitchen = function (callback) {
    Order.find({order_state:'process'}, callback);
};

//Get User Orders
module.exports.getUserOrders = function (user, callback) {
    Order.find({waiter_id: user}, callback);
};

//Get Order Details
module.exports.getOrderDetails = function (id, callback) {
    Order.findOne({_id:id}, callback);
};

//Get current order id
module.exports.getCurrentCount = function (type, callback) {
    if(type == 'onsite'){
        this.getOrderStat(function (err, orderCountStat) {
            if(err){
                console.log(err);
            }else{
                var orderCount = orderCountStat.order_count_onsite;
                callback(orderCount);
            }
        });
    }else if(type == 'online'){
        this.getOrderStat(function (err, orderCountStat) {
            if(err){
                console.log(err);
            }else{
                var orderCount = orderCountStat.order_count_online;
                callback(orderCount);
            }
        });
    }else if(type == 'delivered'){
        this.getOrderStat(function (err, orderCountStat) {
            if(err){
                console.log(err);
            }else{
                var orderCount = orderCountStat.order_count_delivered;
                callback(orderCount);
            }
        });
    }

};

//Get current time
module.exports.getDayInfo = function () {
    var d = new Date();
    var date = d.toDateString();
    var hours = d.getHours().toString();
    var mins = d.getMinutes().toString();
    var ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    mins = mins < 10 ? '0'+mins : mins;
    var time = hours + ':' + mins + ' ' + ampm;


    var dayInfo = {
        date: date,
        time: time
    };

    return dayInfo;
};

module.exports.getItems = function (whatToGet, callback ) {
    whatToGet.find(callback);
};

module.exports.getOrderStat = function (callback){

    var today = new Date();

    var date = today.getDate().toString();
    var month = today.getMonth().toString();
    var year = today.getFullYear().toString();

    var todayString = date + '.' + month + '.' + year;

    var query = {date: todayString};

    DateOnsiteOrder.findOne(query, callback);
};

module.exports.getItemsForOrder = function (callback) {
    var d = new Date();

    var time = d.getHours().toString();

    if(time < 12) {
        return this.getItems(BreakfastItems, callback);
    }
    if(time >= 12 && time <= 16) {
        return this.getItems(LunchItems, callback);
    }
    if(time > 16) {
        return this.getItems(DinnerItems, callback);
    }
};

//module.exports.setDateStat = function (callback) {
//    var date = new Date().toString();
//
//    var newDate = new DateOnsiteOrder({
//        date: date,
//        order_count: 0
//    });
//
//    newDate.save(callback);
//};

module.exports.setOrderStat = function (stat, val, callback) {
    console.log("Entered to" + val);
    if (val == 'onsite'){
        var onsiteOrderCount = stat.order_count_onsite  + 1;
        var query = {date: stat.date};
        DateOnsiteOrder.findOneAndUpdate(query, {order_count_onsite:onsiteOrderCount}, callback);

    }else if (val == 'online'){
        var onlineoOrderCount = stat.order_count_online + 1;
        var query = {date: stat.date};
        DateOnsiteOrder.findOneAndUpdate(query, {order_count_online:onlineoOrderCount}, callback);

    }else if (val == 'delivered'){
        var deliveredOrderCount = stat.order_count_delivered + 1;
        console.log("Finished" + deliveredOrderCount);
        var query = {date: stat.date};

        DateOnsiteOrder.findOneAndUpdate(query, {order_count_delivered:deliveredOrderCount}, callback);
    }
};

module.exports.setOrderStatus = function (id, status, callback) {
    var query = {_id:id};
    var dayInfo = this.getDayInfo();
    Order.findOneAndUpdate(query, {order_state: status, delivered_time: dayInfo.time}, callback);
};

module.exports.createNewOrder = function (req, callback) {
    var dayInfo = this.getDayInfo();
    this.getCurrentCount('onsite', function (orderCount) {

        var itemCount = req.body.item_count;
        var orderItem = req.body.order_item;
        var orderItemQty = req.body.order_item_qty;
        var orderItemPrice = req.body.order_item_price;

        var order_items=[];
        var total=0;

        //Iterating through all the items in the order
        for (var i=1; i<=itemCount; i++){
            console.log(i);
            var item = {
                item_name : orderItem[i],
                item_qty : orderItemQty[i],
                unit_price: orderItemPrice[i]
            };

            total += parseInt(orderItemPrice[i]);

            order_items.push(item);
        }

        var order = new Order({
            order_id: 'onsite#' + orderCount + 1,
            order_type: 'on-site',
            order_date: dayInfo.date,
            order_time: dayInfo.time,
            delivered_time: dayInfo.time,
            order_state: 'created',
            table_no: req.body.table_no,
            waiter_id: req.params.id,
            waiter_name: req.user.first_name+ " " +req.user.last_name,
            waiter_pic: req.user.picture,
            customer_name: req.body.customer_name,
            items: order_items,
            order_total: total
        });

        var orderToPush = {
            order_id: 'onsite#' + orderCount + 1,
            order_type: 'on-site',
            order_date: dayInfo.date,
            order_time: dayInfo.time,
            delivered_time: dayInfo.time,
            order_state: 'created',
            table_no: req.body.table_no,
            customer_name: req.body.customer_name,
            items: order_items,
            order_total: total
        };

        var userId = req.params.id;
        var id_query = {_id : userId};

        User.findOneAndUpdate(id_query, {$push: {'orders': orderToPush}}, function (err) {
            if (err) {
                console.log(err);
            }else{
                order.save(callback);
            }
        });
    });
};

module.exports.addItemToCart = function (item, callback) {
    console.log("Cart Items" + item);

    var name = item.item_name;
    var price = parseInt(item.item_price);
    var image = item.item_image;
    var item_qty = 1;
    var query = {item_id:item._id};

    Cart.findOne(query, function (err, cartItem) {
        if(err){
            console.log(err);
        }else{
            if(cartItem == null){
                var toCart = new Cart({
                    item_id: item._id,
                    item_name : name,
                    item_image: image,
                    item_price: price,
                    item_qty: item_qty
                });

                toCart.save(toCart, callback)
            }else{
                var qty = cartItem.item_qty + 1;
                var unit_price = qty * item.item_price;
                Cart.findOneAndUpdate(query, {item_qty: qty, item_price: unit_price}, function (err) {
                    if(err){
                        console.log(err);
                    }else{
                        callback();
                    }
                });
            }
        }
    });
};

module.exports.removeItemFromCart = function (item, callback) {

    var item_qty = 0;
    var unit_price=0;

    Cart.findOne({item_id:item}, function (err, cartItem) {
        if(err){
            console.log(err);
        }else{
            item_qty = cartItem.item_qty;
            if(item_qty > 1){
                item_qty -= 1;
                var item_price = cartItem.item_price / cartItem.item_qty;
                unit_price = cartItem.item_price - item_price;
                Cart.findOneAndUpdate({item_id:item}, {item_qty: item_qty, item_price: unit_price}, function (err) {
                    if(err){
                        console.log(err);
                    }else{
                        callback();
                    }
                });
            }else{
                Cart.remove({item_id:item}, callback);
            }
        }
    });
};

module.exports.getCartItems = function (callback) {
    Cart.find(callback);
};

module.exports.clearCart = function (callback) {
    Cart.remove({}, callback);
};

module.exports.addNewOnlineOrder = function (id, callback) {
    var Customer="";
    var orderNumber = this.getCurrentCount('online', function (orderCount) {
        return orderCount;
    });
    var dayInfo = this.getDayInfo();
    this.getCartItems(function (err, items) {
        if(err){
            console.log(err);
        }else{
            User.findOne({_id: id}, function (err, customer) {
                if(err){
                    console.log(err);
                }else{
                    Customer = customer.first_name + ' ' + customer.last_name;
                    var grand_total=0;
                    var cart_items =[];

                    for(var i=0;i<items.length;i++){
                        var cartItem = {
                            item_name: items[i].item_name,
                            item_qty: items[i].item_qty,
                            unit_price: items[i].item_price
                        };
                        cart_items.push(cartItem);
                        grand_total += parseInt(items[i].item_price);
                    }

                    var newOnlineOrder = new Order({
                        order_number: 'online#' + orderNumber + 1,
                        order_type: 'on-line',
                        order_date: dayInfo.date,
                        order_time: dayInfo.time,
                        delivered_time: dayInfo.time,
                        order_state: 'created',
                        table_no: 0,
                        waiter_id: id,
                        waiter_name: 'n/a',
                        customer_name: Customer,
                        items: cart_items,
                        order_total: grand_total
                    });

                    newOnlineOrder.save(function () {
                        Cart.remove({}, callback);
                    });
                }
            });
        }
    });
};
