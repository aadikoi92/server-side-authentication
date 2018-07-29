const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//schema tells how many fields or attributes/properties a model has.
const Schema = mongoose.Schema;


//define our model -- structure of model

const userSchema = new Schema ({
    email: { type: String, unique: true, lowercase: true }, //JS Strings, email has to be unique, tell mongodb it is unique-> unique: true
    password: String
});


//on save hook, encrypt password
//before saving a model run this function below
userSchema.pre('save', function (next) {
    const user = this; //just getting access to user model -- user is an instance of the user model

 //generate a salt, takes some time to generate salt thus callback

    bcrypt.genSalt(10, function (err, salt) {
        if (err) { return next (err); }

 //haash (encrpt) takes time thus call back its -> hash is pw      
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            
            if(err) { return next (err); }

            user.password = hash;
            next();
        
        });
    });
});

//add a method to user model for password comparision, whenever we create a user object it is going to have access to 
//functions in methods

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) { return callback(err); }

        callback(null, isMatch);
    });
}

//create a model class of userSchema and save the collection as 'user'
//loads the schema above to mongoose and corresponds to a collection 'user'

const ModelClass = mongoose.model('user', userSchema);



//export the model
module.exports = ModelClass;

