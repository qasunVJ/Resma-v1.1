var mongoose = require('mongoose');

var tableViewSchema = mongoose.Schema({
    modal_name: {type: String},
    table_data: {type: String},
    table_num: {type: Number}
});

var TableView = module.exports = mongoose.model('TableView', tableViewSchema);