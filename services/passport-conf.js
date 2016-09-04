module.exports = function () {
    var passport = require('passport');
    var passportLocal = require('passport-local');
    var bcrypt = require('bcryptjs');
    var UserService = require('./user-service');

    passport.use(new passportLocal.Strategy(
        function(username, password, done) {
            UserService.getUserByUsername({ username: username }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    //return done(null, false, { message: 'Incorrect username' });
                    return done(null, null);
                }
                bcrypt.compare(password, user.password, function (err, same) {
                    if (err){
                        return err;
                    }
                    if (!same){
                        return (null, null);
                    }
                    done(null, user);
                });

                //UserService.comparePassword(password, user.password, function (err, isMatch) {
                //    if (err) return done(err);
                //    if (isMatch){
                //        return done(null, user);
                //    }else{
                //        console.log('Invalid Password');
                //        //Failure Message
                //        return done(null, false, {message: 'Invalid password'});
                //    }
                //});

            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        UserService.getUserByUsername({username: username}, function(err, user) {
            done(err, user);
        });
    });
}