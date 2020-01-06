'use strict';
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Un utilisateur est un nom, son email (unique) qui sert aussi d'identifiant et son mot de passe. 
 */
var UserSchema = new Schema({
    name: {
        type : String,
        trim : true,
        required : true
    },
    email: {
        type : String,
        trim : true,
        unique : true,
        lowercase : true,
        required : true
    },
    password: {
        type : String,
        required : true,
    }
  });

UserSchema.methods.comparePassword = function(psw) {
    return bcrypt.compareSync(psw, this.password);
}

mongoose.model('User', UserSchema);
