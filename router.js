//all the routes to serve up data  set up...export a function from here to index.js and pass app to imported function
//we have access to app in this file from index.js
//req-info about the incoming requests. res response to req. next for error handling
const Authentication = require('./controllers/authentication');
const passport = require('passport');
const passportService = require('./services/passport');


//create an object to insert into the middleware passport between incoming request and  route handler
//requireAuth object is the middleware intercepter, to authenticate 
//use jwt strategy and when authenticated dont create cookie based session thus false

const requireAuth = passport.authenticate('jwt', { session: false });

//signin route agadi passthrough middleware
const requireSignin = passport.authenticate('local', {session: false});


module.exports = function(app) {
    //dummy route, middle argument is middleware first pass through it
    app.get('/', requireAuth, function(req, res){
        res.send({ hi : "there"});
    });
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
}
