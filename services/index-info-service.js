var IndexInfo = require('../models/index');

module.exports.getIndexInfo = function (callback) {
    IndexInfo.find(callback);
};

module.exports.getCategoryInfo = function (category, callback) {
    var id = {_id: category};
    IndexInfo.findOne(id, callback);
};