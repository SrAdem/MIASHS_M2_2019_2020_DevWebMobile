var express = require('express');
var app = express();
var http = require('http').Server(app);
var User = require('../model/user.js');
var htmlspecialchars = require('htmlspecialchars');

/*Session utilisateur*/
var session = require('express-session');
var sessionOptions = {
    secret: "12345",
    cookie: {
        maxAge:120000
    },
    saveUninitialized: false,
    resave:false
};
app.use(session(sessionOptions));

/*Pour envoyer les pages html avec le style css, sinon le style ne va pas être appliqué*/
app.use(express.static(__dirname.slice(0,-7)+'client'));
app.set('views', __dirname.slice(0,-7) + '\client')
var engine = require('consolidate');
app.engine('html', engine.mustache);
app.set('view engine', 'html');

/*Liste des utilisateurs*/
var users = [{id: 1, name: "Abdoulaye SARR" , email: "dadsarr@hotmail.fr", password:"toto"},
              {id: 2, name: "Ibro SARR" , email: "ibrosarr@hotmail.fr", password:"titi"}
            ];

/*Pour avoir accès aux données du corps de la requête*/
app.use(express.urlencoded({ extended: true }));

//Connexion
app.get("/", function(req, res){
    if(req.session.userId){
        res.redirect('/accueil');
    }else{
        res.render('connexion.html');
    }
});

app.post("/", function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    if(email && password){
        var user = users.find(user => user.email === email && user.password === password);
        if(user){
            req.session.userId = user.id;
            res.redirect("/accueil");
        }
    }
    res.render('connexion.html', {message: 'Email ou mot de passe incorrect'});
});


//Accueil
app.get("/accueil", function(req, res){
    if(req.session.userId) {
        var user = users.find(user => user.id === req.session.userId);
        res.render('accueil.html', {user: user});
    }else{
        res.redirect('/');
    }
});

//Déconnexion
app.get("/deconnexion",  function(req, res){
    if(req.session.userId){
        req.session.destroy();
    }
    res.redirect("/");
});

//Inscription
app.get("/inscription", function(req, res){
    res.render('inscription.html');
});

app.post("/inscription", function(req, res){
    //On utilise htmlspecialchars pour éviter l'injection
    var name = htmlspecialchars(req.body.name);
    var email = htmlspecialchars(req.body.email);
    var password = htmlspecialchars(req.body.password);
    if(name && email && password){
        var existe = users.some(user => user.email === email);
        if(!existe){
            var user = new User(users.length+1,name, email, password);
            users.push(user);
            req.session.userId = user.id;
            res.redirect("/accueil");
        }else{
            res.render("inscription.html", {message: "L'utilisateur existe déjà" });
        }
    }
    res.render("inscription.html", {message: "Erreur d'inscription" });
});

http.listen(3000, function(){
    console.log("Server running on 3000")
});
