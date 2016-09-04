var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var UserService = require('../services/user-service');


//Manager schema
var managerSchema = mongoose.Schema({
    first_name: {type: String, required: 'Please enter your First Name'},
    last_name: {type: String, required: 'Please enter your Last Name'},
    user_token: {type: String, required: 'Please enter the token'},
    email: {type: String, required: 'Please enter your email'},
    phone: {type: Number, required: 'Please enter your phone'},
    address: [{
        address1: {type: String, required: 'Please enter your address'},
        address2: {type: String}
    }],
    username: {type: String, required: 'Please enter a Username'},
    password: {type: String, required: 'Please enter a password'}

});

managerSchema.path('username').validate(function (value, next) {
    UserService.getUserByUsername({username: value}, function (err, user) {
        if (err){
            console.log(err);
            return next(false);
        }
        next(!user);
    });
}, 'Username is already in use');

managerSchema.path('user_token').validate(function (value, next) {
    UserService.getUserToken({token: value}, function (err, token) {
        if (err){
            console.log(err);
            return next(true);
        }
        console.log('TOken' +token);
        next(token);
    });
}, 'Your token is not valid');

var Manager = module.exports = mongoose.model('Manager', managerSchema);