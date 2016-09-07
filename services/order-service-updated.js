var Order = require('../models/order');
var NewOrder = require('../models/new-order');
var DateOnsiteOrder = require('../models/dateorderonsite');
var BreakfastItems = require('../models/breakfastitem');
var LunchItems = require('../models/lunchitem');
var DinnerItems = require('../models/dinneritem');
var Waiters = require('../models/waiter');
var UserService = require('../services/user-service');

//Get Orders
module.exports.getOrders = function (callback) {
    Order.find(callback);
};

//Get current order id
module.exports.getCurrentOrderId = function (callback) {
    NewOrder.find(callback);
};

//Get current time
module.exports.getDayInfo = function () {
    var d = new Date();
    var date = d.toDateString();
    var hours = d.getHours().toString();
    var mins = d.getMinutes().toString();
    var time = hours + ':' + mins;

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
    var new_order_stat={};

    var d = new Date();
    var date = d.getDate().toString();
    var month = d.getMonth().toString();
    var year = d.getFullYear().toString();

    var fullDate = date + month + year;

    var query = {date: fullDate};

    DateOnsiteOrder.findOne(query, callback);

    //DateOnsiteOrder.findOne( query, function (order_stat) {
    //
    //    console.log(JSON.stringify(order_stat));
    //    /
    //});
};

module.exports.getItemsForOrder = function (callback) {
    var d = new Date();

    var time = d.getHours().toString();

    if(time < 12) {
        return this.getItems(BreakfastItems, callback);
    }
    if(time > 12 && time < 16) {
        return this.getItems(LunchItems, callback);
    }
    if(time > 16) {
        return this.getItems(DinnerItems, callback);
    }
};

module.exports.setOrderStat = function (stat, callback) {
    var orderCount = stat.order_count;
    orderCount += orderCount;

    console.log('Order Count' + orderCount);
    var query = {date: stat.date};

    DateOnsiteOrder.findOneAndUpdate(query, {order_count:orderCount}, callback);
};

module.exports.createNewOrder = function (req, callback) {
    console.log('Order body:' + req.body);
    var dayInfo = this.getDayInfo();

    var itemCount = req.body.item_count;
    var orderItem = req.body.order_item;
    var orderItemQty = req.body.order_item_qty;
    var order_items=[];

    //Iterating through all the items in the order
    for (var i=0; i<=itemCount; i++){
        console.log(i);
        var item = {
            item_name : orderItem[i],
            item_qty : orderItemQty[i]
        };

        order_items.push(item);
    }

    console.log('Order Items' + order_items);

    var order = new Order({
        order_type: 'on-site',
        order_date: dayInfo.date,
        order_time: dayInfo.time,
        delivered_time: dayInfo.time,
        order_state: 'created',
        table_no: req.body.table_no,
        waiter_id: req.params.id,
        customer_name: req.body.customer_name,
        items: order_items
    });

    order.save(callback);
};
