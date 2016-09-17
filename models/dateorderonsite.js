var mongoose = require('mongoose');

var dateOnsiteOrderSchema = new mongoose.Schema({
    date: {type: String},
    order_count_onsite: {type: Number},
    order_count_online: {type: Number},
    order_count_delivered: {type: Number}
});

var DateOnsiteOrder = module.exports = mongoose.model('DateOnsiteOrder', dateOnsiteOrderSchema);