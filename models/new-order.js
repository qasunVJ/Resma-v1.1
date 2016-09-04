var mongoose = require('mongoose');

var newOrderSchema = new mongoose.Schema({
    curr_order_id : {type: String}
});

var NewOrderSchema = module.exports = mongoose.model('NewOrderSchema', newOrderSchema);