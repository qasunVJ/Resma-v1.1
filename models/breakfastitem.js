var mongoose = require('mongoose');

//Breakfast Menu schema
var breakfastitemSchema = mongoose.Schema({
    item_id: {type: String},
    item_name: {type: String},
    item_disc: {type: String},
    item_price: {type: Number},
    item_type: {type: String},
    item_image: {type: String}
});

var BreakfastItem = module.exports = mongoose.model('BreakfastItem', breakfastitemSchema);