var Order = require('../models/order');
var NewOrder = require('../models/new-order');
var DateOnsiteOrder = require('../models/dateorderonsite');

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

module.exports.setOrderStat = function (stat, callback) {
    var orderCount = stat.order_count;
    orderCount += orderCount;

    console.log(orderCount);
    var query = {date: stat.date};

    DateOnsiteOrder.findOneAndUpdate(query, {order_count:orderCount}, callback);
};

module.exports.createNewOrder = function (order, callback) {
    order.save(callback);
};
