require('dotenv').config();

// express + socketio + jsonwebtoken
var express = require('express');
var app = express();
var http = require('http').Server(app);
var socketioJwt = require('socketio-jwt');
var socket = require('socket.io');
var io = socket.listen(http);
var jwt = require('jsonwebtoken');
var htmlspecialchars = require('htmlspecialchars');
//database + secur
var mongoose = require('mongoose');
require('./mongoCo');
var bcrypt = require('bcryptjs');

//Models
require('../model/roomModel');
require('../model/userModel');
var Room = mongoose.model('Room');
var User = mongoose.model('User');


app.use(express.json())
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

/*Pour avoir accès aux données du corps de la requête*/
app.use(express.urlencoded({ extended: true }));

/*Gestion du routage*/
//Connexion
app.get('/', function(req, res)
{
    if(req.session.userId){
        res.redirect('/jeuDame');
    }else{
        res.render('accueil.html');
    }
});

//Inscription
app.post('/inscription', function(req, res)
{
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
});

//Page de jeu
app.get('/jeuDame', function(req, res)
{
    if(req.session.userId){
        User.findOne({_id : req.session.userId}, function(err, user) {
            const accessToken = jwt.sign({id : user.id, name : user.name, email : user.email}, process.env.ACCESS_TOKEN_SECRET);
            res.render('jeuDame.html', {user: user, accessToken: accessToken});
        });
    }else{
        res.render('accueil.html');
    }
});

app.post('/jeuDame', function(req, res)
{
    var email = htmlspecialchars(req.body.email);
    var password = htmlspecialchars(req.body.password);
    if(email && password){
        User.findOne({email : email},
            function(err, user) {
                if (err) throw err;
                if (!user) {
                    res.render('accueil.html', {message: 'Email ou mot de passe incorrect'});
                } else if (user) {
                    if (!user.comparePassword(req.body.password)) {
                        res.render('accueil.html', {message: 'Email ou mot de passe incorrect'});
                    } else {
                        req.session.userId = user._id;
                        const accessToken = jwt.sign({id : user.id, name : user.name, email : user.email}, process.env.ACCESS_TOKEN_SECRET);
                        res.render('jeuDame.html', {user: user, accessToken: accessToken});
                    }
                }
            });
    }
    else {
        res.render('accueil.html', {message: 'Email ou mot de passe incorrect'});
    }
});

//Déconnexion
app.get('/deconnexion', function(req, res)
{
    if(req.session.userId){
        req.session.destroy();
    }
    res.redirect("/");
});

/****************************** Socket ******************************/
io.on('connection', socketioJwt.authorize({
    secret: process.env.ACCESS_TOKEN_SECRET,
    timeout: 15000
}));

var currentRoom = 0;
var rooms = [];
var waitingList = [];

io.on('authenticated', function (socket) {
    var mysocket = socket;
    var mytoken = socket.decoded_token;

    //On regarde si on est pas déjà sur une table
    var myroom = rooms.find(room => (room.firstPlayer.token.id === mytoken.id || room.secondPlayer.token.id === mytoken.id));
    if(myroom) { //On est déjà sur une table
        //On se retrouve dans les rooms pour mettre à jour le token et la socken. !!!!! Utile si l'utilisateur refresh sa page et perd ces informations la.
        var splayer;
        if (myroom.firstPlayer.token.id === mytoken.id) {
            myroom.firstPlayer.token = mytoken;
            myroom.firstPlayer.socket = mysocket;
            splayer = myroom.secondPlayer;
        }
        else {
            myroom.secondPlayer.token = mytoken;
            myroom.secondPlayer.socket = mysocket;
            splayer = myroom.firstPlayer;
        }
        //On re rejoint la room du jeu.
        socket.join('room'+myroom.room);
        socket.emit('secondPlayer', {name : splayer.token.name});
    }

    mysocket.on('findGame', function() {
        //Sinon, on se met dans la liste s'il n'y a personne à affronter
        if(waitingList.length === 0) {
            waitingList.push({token : mytoken, socket : mysocket});
        }
        //S'il y a quelqu'un à affronter
        else {
            //On fait en sorte que chaque joueur a acces aux informations de l'autre joueur et qu'ils entrent dans la même "room"
            var otherPlayer = waitingList.pop();
            otherPlayer.socket.emit('secondPlayer',{name : mytoken.name, email : mytoken.email});
            otherPlayer.socket.join('room' + currentRoom);
            mysocket.emit('secondPlayer',{name : otherPlayer.token.name, email : otherPlayer.token.email});
            mysocket.join('room' + currentRoom);
            //on enregistre la partie
            rooms.push( {room : currentRoom, firstPlayer : otherPlayer, secondPlayer : {token : mytoken, socket : mysocket} } );
            currentRoom++;
        }
    })

    mysocket.on('endGame', function() {
        //On récupère la salle des deux joueurs
        myroom = rooms.find(room => (room.firstPlayer.token.id === mytoken.id || room.secondPlayer.token.id === mytoken.id));
        //Pour en extraire le token et la socket de l'autre joueur
        var otherPlayer = (myroom.firstPlayer.token === mytoken) ? myroom.secondPlayer : myroom.firstPlayer ;
        //On créer le résultat pour l'insérer dans la base de donnée
        var newRoom = new Room({room : myroom.room, firstPlayer : myroom.firstPlayer.token.id, secondPlayer : myroom.secondPlayer.token.id, winner : mytoken.id});
        //On l'enregistre
        newRoom.save(function(err, user) {
            if (err) {
                console.log("erreur d'insertion des résultats !!");
            } else {
                //Et on affiche les résultats aux utilisateurs
                mysocket.emit("results", true);
                otherPlayer.socket.emit("results", false);
            }
        });
        rooms.splice(rooms.indexOf(myroom));
    })
    
    mysocket.on('disconnect', function(){
        var pos = waitingList.indexOf({token : mytoken, socket : mysocket});
        waitingList.splice(pos,1);
    })
});

http.listen(3000, function(){
    console.log("Server running on 3000")
});
