var User = require('../models/user');
var Waiter = require('../models/waiter');
var Manager = require('../models/manager');
var Customer = require('../models/customer');
var Token = require('../models/token');
var bcrypt = require('bcryptjs');

module.exports.addNewToken = function (token, callback) {
    token.save(callback);

};

module.exports.getUserToken = function (candidate_token, callback) {
    Token.findOne(candidate_token, function (err, token) {
        callback(err, token);
    });
};

module.exports.getUserById = function (id, callback) {
    var query = {_id: id};
    User.findOne(query, callback);
};

module.exports.getTypeById = function (id, callback) {
    User.find({ user_type: true }).where('created_at').gt(monthAgo).exec(function(err, users) {
        if (err) throw err;

        // show the admins in the past month
        console.log(users);
    });
};

module.exports.getUserByUsername = function(username, callback){
    User.findOne(username, function (err, user) {
        callback(err, user);
    });
};

//Create User
module.exports.createUser = function (req, callback) {
    bcrypt.hash(req.body.password, 10, function(err, hash){
        if (err) {
            return  err;
        }

        var userType = req.params.id;
        console.log('User Type:' +userType);

        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var user_token = req.body.user_token;
        var email = req.body.email;
        var phone = req.body.phone;
        var address1 = req.body.address1;
        var address2 = req.body.address2;
        var username = req.body.username;
        var password = hash;

        //New User
        var newUser = new User({
            first_name: first_name,
            last_name: last_name,
            user_type: userType,
            user_token: user_token,
            email: email,
            phone: phone,
            address: [{
                address1: address1,
                address2: address2
            }],
            username: username,
            password: password
        });

        //var newWaiter = new Waiter({
        //    first_name: first_name,
        //    last_name: last_name,
        //    user_token: user_token,
        //    email: email,
        //    phone: phone,
        //    address: [{
        //        address1: address1,
        //        address2: address2
        //    }],
        //    username: username
        //});
        //
        //var newManager = new Manager({
        //    first_name: first_name,
        //    last_name: last_name,
        //    user_token: user_token,
        //    email: email,
        //    phone: phone,
        //    address: [{
        //        address1: address1,
        //        address2: address2
        //    }],
        //    username: username
        //});
        //
        //var newCustomer = new Customer({
        //    first_name: first_name,
        //    last_name: last_name,
        //    email: email,
        //    phone: phone,
        //    username: username
        //});

        newUser.save(function (err) {
            if (err){
                return callback(err);
            }
            callback(null);
        });

        //if (userType == 'waiter'){
        //    async.parallel([newUser.save, newWaiter.save], function (err) {
        //        if (err){
        //            return callback(err);
        //        }
        //        callback(null);
        //    });
        //}else if(userType == 'manager'){
        //    async.parallel([newUser.save, newManager.save], function (err) {
        //        if (err){
        //            return callback(err);
        //        }
        //        callback(null);
        //    });
        //}else{
        //    async.parallel([newUser.save, newCustomer.save], function (err) {
        //        if (err){
        //            return callback(err);
        //        }
        //        callback(null);
        //    });
        //}
    });
};

////Compare Password
//module.exports.comparePassword = function(candidatePassword, hash, callback){
//    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
//        if (err) throw err;
//        callback(null, isMatch);
//    });
//};
