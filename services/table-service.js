var TableView = require('../models/tableview');


//Get table view
module.exports.getTableView = function (callback) {
    TableView.find(callback);
};

//Update table view
module.exports.updateTableView = function (tableview, callback) {
    TableView.update({modal_name: 'table_view'}, tableview, callback);
};