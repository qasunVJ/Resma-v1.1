var mongoose = require('mongoose');

//Lunch menu schema
var lunchitemSchema = mongoose.Schema({
    item_id: {type: String},
    item_name: {type: String},
    item_disc: {type: String},
    item_price: {type: Number},
    item_type: {type: String},
    item_image: {type: String}
});

var LunchItem = module.exports = mongoose.model('LunchItem', lunchitemSchema);

