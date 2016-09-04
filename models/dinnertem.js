var mongoose = require('mongoose');

//Lunch menu schema
var dinneritemSchema = mongoose.Schema({
    item_name: {type: String},
    item_disc: {type: String},
    item_price: {type: Number},
    item_type: {type: String}
});

var DinnerItem = module.exports = mongoose.model('DinnerItem', dinneritemSchema);

