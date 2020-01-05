require('dotenv').config();

// express + socketio + jsonwebtoken
var express = require('express');
var app = express();
var http = require('http').Server(app);
var socketioJwt = require('socketio-jwt');
var socket = require('socket.io');
var io = socket.listen(http);

//database + secur
var mongoose = require('mongoose');
require('./mongoCo');
var bcrypt = require('bcryptjs');

//Models
require('../model/roomModel');
require('../model/userModel');
var Room = mongoose.model('Room');


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

/*Le routage*/
var routes = require('./routes');
routes(app);

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
        if (myroom.firstPlayer.token.id === mytoken.id) {
            myroom.firstPlayer.token = mytoken;
            myroom.firstPlayer.socket = mysocket;
        }
        else {
            myroom.secondPlayer.token = mytoken;
            myroom.secondPlayer.socket = mysocket;
        }
        //On re rejoint la room du jeu.
        socket.join('room'+myroom.room);
        var splayer;
        if(myroom.firstPlayer === mytoken){
            splayer = myroom.secondPlayer;
        }
        else {
            splayer = myroom.firstPlayer;
        }
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
        var newRoom = new Room({room : myroom.room, firstPlayer : myroom.firstPlayer.token.id, secondPlayer : myroom.secondPlayer.token.id, winner : mytoken.id});3
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
