var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    order_type: {type: String},
    order_date: {type: String},
    order_time: {type: String},
    delivered_time: {type: String},
    order_state: {type: String},
    table_no: {type: Number},
    waiter_id: {type: String},
    waiter_name: {type: String},
    customer_name: {type: String},
    items: [{
        item_name: {type:String},
        item_qty: {type: Number},
        item_price: {type: Number}
    }],
    order_total: {type:Number}
});

var Order = module.exports = mongoose.model('Order', orderSchema);
