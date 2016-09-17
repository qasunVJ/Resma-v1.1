var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var UserService = require('../services/user-service');


//Users schema
var userSchema = mongoose.Schema({
    first_name: {type: String, required: 'Please enter your First Name'},
    last_name: {type: String, required: 'Please enter your Last Name'},
    user_type: {type: String},
    user_token: {type: String, required: 'Please enter the token'},
    email: {type: String, required: 'Please enter your email'},
    phone: {type: Number, required: 'Please enter your phone'},
    address: [{
        address1: {type: String, required: 'Please enter your address'},
        address2: {type: String}
    }],
    username: {type: String, required: 'Please enter a Username'},
    password: {type: String, required: 'Please enter a password'},
    orders:[{
        order_number: {type: Number},
        order_type: {type: String},
        order_date: {type: String},
        order_time: {type: String},
        delivered_time: {type: String},
        order_state: {type: String},
        table_no: {type: Number},
        customer_name: {type: String},
        items: [{
            item_name: {type:String},
            item_qty: {type: Number}
        }],
        order_total: {type:Number}
    }]

});

userSchema.path('username').validate(function (value, next) {
    UserService.getUserByUsername({username: value}, function (err, user) {
        if (err){
            console.log(err);
            return next(false);
        }
        next(!user);
    });
}, 'Username is already in use');

userSchema.path('user_token').validate(function (value, next) {
    UserService.getUserToken({token: value}, function (err, token) {
        if (err){
            console.log(err);
            return next(true);
        }
        console.log('TOken' +token);
        next(token);
    });
}, 'Your token is not valid');

var User = module.exports = mongoose.model('User', userSchema);