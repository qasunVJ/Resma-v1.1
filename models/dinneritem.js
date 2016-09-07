var mongoose = require('mongoose');

//Lunch menu schema
var dinneritemSchema = mongoose.Schema({
    item_id: {type: String},
    item_name: {type: String},
    item_disc: {type: String},
    item_price: {type: Number},
    item_type: {type: String},
    item_image: {type: String}
});

var DinnerItem = module.exports = mongoose.model('DinnerItem', dinneritemSchema);

