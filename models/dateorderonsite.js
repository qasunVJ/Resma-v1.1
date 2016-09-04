var mongoose = require('mongoose');

var dateOnsiteOrderSchema = new mongoose.Schema({
    date: {type: String},
    order_count: {type: Number}
});

var DateOnsiteOrder = module.exports = mongoose.model('DateOnsiteOrder', dateOnsiteOrderSchema);