var mongoose = require('mongoose');

//Index info schema
var indexinfoSchema = mongoose.Schema({
    category: {type: String},
    infoLess: {type: String},
    infoFull: {type: String}
});

var IndexInfo = module.exports = mongoose.model('IndexInfo', indexinfoSchema);