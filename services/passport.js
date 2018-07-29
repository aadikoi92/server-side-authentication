//logic to help set up passport which helps us authenticate user when they visit certain routes
//purpose of pp is whether user loggein or not before hiting controllers
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');

const JwtStrategy = require('passport-jwt').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local');

//create local strategy, obj options tell LS where to look in the request to get access to username
const localOptions = { usernameField: 'email'};

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    //verify username and passowr , call done with the user if correct else call done with false

    User.findOne({email: email}, function(err,user){
       
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        //compare passwords if password = user.password?bcrypted

        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if(!isMatch) { return done(null, false); }

            return done(null, user);
        });

    });
});





//set up options for jwt strategy for configuration of strategy
//jwt tokens can sit anywhere headers or body or of the request
//specifically tell our strategy where to look on request to find this key, extract the token from
//a header called authorization-- telling jwt strat when req comes and want pp to handle look for in header
//also tell jwt strategy the secret it should decode this token

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//create jwt strategy--payload is decoded jwt token from authentication returned jwt, done is a callback success or failed authentication

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
   // see if the user id in the payload exists in db. if yes call 'done' with that user
   //otherwise call 'done' without user object
   User.findById(payload.sub, function(err, user) {
       if (err) { return done(err, false); }

       if(user) {
           done(null, user);
       } else {
           done(null, flase);
       }
   });
});



// tell passport to use this strategy -- wire up passport and the strategy we created

passport.use(jwtLogin);


//tell passport to use local strategy
passport.use(localLogin);