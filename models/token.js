var mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
    token_type: {type: String},
    token: {type: String}
});

var Token = module.exports = mongoose.model('Token', tokenSchema);