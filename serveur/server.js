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
    console.log('connected: ' + mytoken);

    //On regarde si on est pas déjà sur une table
    var myroom = rooms.find(room => (room.firstPlayer.id === mytoken.id || room.secondPlayer.id === mytoken.id));
    if(myroom) { //On est déjà sur une table
        socket.join('room'+myroom.room);
        var splayer;
        if(myroom.firstPlayer === mytoken){
            splayer = myroom.secondPlayer;
        }
        else {
            splayer = myroom.firstPlayer;
        }
        socket.emit('secondPlayer', {name : splayer.name, email: splayer.email});
        console.log("Retour à la table");
    }
    //Sinon, on se met dans la liste s'il n'y a personne à affronter
    else if(waitingList.length === 0) {
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
        rooms.push( {room : currentRoom, firstPlayer : otherPlayer.token, secondPlayer : mytoken} );
        currentRoom++;
    }

    socket.on('endGame', function() {
        var newRoom = new Room({room : myroom.room, firstPlayer : myroom.firstPlayer.id, secondPlayer : myroom.secondPlayer.id, winner : mytoken.id});
        newRoom.save(function(err, user) {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                console.log("ok");
            }
        });
        console.log(rooms.indexOf(myroom));
    })
    
    socket.on('disconnect', function(){
        console.log('disconnected: ' + mytoken);
    })
});

http.listen(3000, function(){
    console.log("Server running on 3000")
});
