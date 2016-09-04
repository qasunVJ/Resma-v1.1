var mongoose = require('mongoose');

//Breakfast Menu schema
var menuItemSchema = mongoose.Schema({
    item_name: {type: String},
    item_price: {type: String},
    item_disc: {type: String},
    item_type: {type: String}
});

var MenuItem = module.exports = mongoose.model('MenuItem', menuItemSchema);