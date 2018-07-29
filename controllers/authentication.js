//imported user model
const User = require('../models/user');

const jwt = require('jwt-simple');
const config = require('../config');


//a function takes user id anc encode it with secret, use userid cause email maybe changing, first arg info to encode
//sub -> is a standard property for jwt, iat -- issued at time

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function (req, res, next) {
    //user has already had their email pw authd just give them a token
    res.send({ token: tokenForUser(req.user) });

}


exports.signup = function (req, res, next) {

const email = req.body.email;
const password = req.body.password;

if ( !email || !password) {
    return res.status(422).send( { error: 'you must provide email and password!'} )
}
    
//see if a user with given email exists
//class of users, all user belo

User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    //if a user with email exist, return an error

    if (existingUser) {
        return res.status(422).send( {error: 'email is in use'} );
    }

    //doesn't exist create and save one
    const user = new User({
        email: email,
        password: password
    });

    user.save(function (err){
        if (err) { return next(err);}
        
        // respond to request indicating user was created send back token
        res.json({ token: tokenForUser(user) });
    });


});
  
}