'use strict';
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var htmlspecialchars = require('htmlspecialchars');
require('dotenv').config();

exports.register = function(req, res, next) {
    //On utilise htmlspecialchars pour éviter l'injection
    var name = htmlspecialchars(req.body.name);
    var email = htmlspecialchars(req.body.email);
    var password = htmlspecialchars(req.body.password);
    if(name && email && password){
        var test = User.findOne({email : email})
            .then ((user) => {
                if(user) {
                    return res.render("accueil.html", {message: "L'utilisateur existe déjà" });
                }
                else{
                    var newUser = new User(req.body);
                    newUser.password = bcrypt.hashSync(req.body.password, 10);
                    newUser.save(function(err, user) {
                        if (err) {
                            return res.status(400).send({
                                message: err
                            });
                        } else {
                            user.hash_password = undefined;
                            return res.render("accueil.html", {message: "Compte crée avec succes !" });
                        }
                    });
                }
            });
    }  else {
        res.render("accueil.html", {message: "Erreur d'inscription" });
    }
};

exports.sign_in = function(req, res) {
    console.log("ici")
    var email = req.body.email;
    var password = req.body.password;
    if(email && password){
        User.findOne({email : email},
            function(err, user) {
                if (err) throw err;
                if (!user) {
                    res.status(401).json({ message: 'Authentication failed. User not found.' });
                } else if (user) {
                    if (!user.comparePassword(req.body.password)) {
                        res.status(401).json({ message: 'Authentication failed. Wrong password.' });
                    } else {
                        req.session.userId = user._id;
                        const accessToken = jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET);
                        res.render('jeuDame.html', {user: user, accessToken: accessToken});
                    }
                }
            });
    }
    else {
        res.render('connexion.html', {message: 'Email ou mot de passe incorrect'});
    }
};

exports.loginRequired = function(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' });
    }
};
  