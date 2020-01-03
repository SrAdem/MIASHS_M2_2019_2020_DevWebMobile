'use strict';
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var htmlspecialchars = require('htmlspecialchars');
require('dotenv').config();

exports.register = function(req, res) {
    //On utilise htmlspecialchars pour éviter l'injection
    var name = htmlspecialchars(req.body.name);
    var email = htmlspecialchars(req.body.email);
    var password = htmlspecialchars(req.body.password);
    if(name && email && password){
        User.findOne({email : email
        }, function(err, user) {
            if(user) {
                var newUser = new User(req.body);
                newUser.password = bcrypt.hashSync(req.body.password, 10);
                newUser.save(function(err, user) {
                    if (err) {
                        return res.status(400).send({
                            message: err
                        });
                    } else {
                        user.hash_password = undefined;
                        return res.json(user);
                    }
                });
            }
            if(err) {
                res.render("inscription.html", {message: "Erreur d'inscription" });
            }
            else {
                res.render("inscription.html", {message: "L'utilisateur existe déjà" });
            }
        });
        // if(!existe){
        //     var newUser = new User(req.body);
        //     newUser.password = bcrypt.hashSync(req.body.password, 10);
        //     newUser.save(function(err, user) {
        //         if (err) {
        //             return res.status(400).send({
        //                 message: err
        //             });
        //         } else {
        //             user.hash_password = undefined;
        //             return res.json(user);
        //         }
        //     });
        //     req.session.userId = newUser._id;
        //     res.redirect("/accueil");
        // }else{
        //     res.render("inscription.html", {message: "L'utilisateur existe déjà" });
        // }
    }
    else {
        res.render("inscription.html", {message: "Erreur d'inscription" });
    }
};

exports.sign_in = function(req, res) {
    User.findOne({
        _id: req.body.id
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
        res.status(401).json({ message: 'Authentication failed. User not found.' });
        } else if (user) {
            if (!user.comparePassword(req.body.password)) {
                res.status(401).json({ message: 'Authentication failed. Wrong password.' });
            } else {
                return res.json({token: jwt.sign( user._id, process.env.ACCESS_TOKEN_SECRET)});
            }
        }
    });
};

exports.loginRequired = function(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' });
    }
};
  