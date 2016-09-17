var mongoose = require('mongoose');

//Breakfast Menu schema
var cartitemSchema = mongoose.Schema({
    item_id: {type: String},
    item_name: {type: String},
    item_image: {type: String},
    item_price: {type: String},
    item_qty: {type: Number}
});

var CartItem = module.exports = mongoose.model('CartItem', cartitemSchema);