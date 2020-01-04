require('dotenv').config();

// express + socketio + jsonwebtoken
var express = require('express');
var app = express();
var http = require('http').Server(app);
var jwt = require('jsonwebtoken');
var socketioJwt = require('socketio-jwt');
var socket = require('socket.io');
var io = socket.listen(http);

//database + secur
var mongoose = require('mongoose');
require('./mongoCo');
var bcrypt = require('bcryptjs');

//Models
var User = require('../model/userModel');


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

/*Liste des utilisateurs*/
var users = [{id: 1, name: "Abdoulaye SARR" , email: "dadsarr@hotmail.fr", password:"toto"},
              {id: 2, name: "Ibro SARR" , email: "ibrosarr@hotmail.fr", password:"titi"}
            ];

/*Pour avoir accès aux données du corps de la requête*/
app.use(express.urlencoded({ extended: true }));


var routes = require('./routes');
routes(app);

/****************************** Socket ******************************/
io.on('connection', socketioJwt.authorize({
    secret: process.env.ACCESS_TOKEN_SECRET,
    timeout: 15000
}));

var room = 0;
var rooms = [];
io.on('authenticated', function (socket) {
    var token = parseInt(socket.decoded_token);
    console.log('connected: ' + token);
    var myroom = rooms.find(room => (room.firstPlayer === token || room.secondPlayer === token) && room.state === true);
    if(myroom) {
        socket.join('room'+myroom.room);
        var splayer;
        if(myroom.firstPlayer === parseInt(socket)){
            splayer = users.find(user => user.id === myroom.secondPlayer);
        }
        else {
            splayer = users.find(user => user.id === myroom.firstPlayer);
        }
        socket.emit('secondPlayer', {name : splayer.name, email: splayer.email});
        console.log("Retour à la table");
    }
    else if( (! rooms[room])) {
        socket.join('room' + room);
        rooms[room] = {};
        rooms[room].room = room;
        rooms[room].firstPlayer = token;
    }
    else if ( ! rooms[room].secondPlayer && rooms[room].firstPlayer != token) {
        var splayer = users.find(user => user.id === token);
        socket.to('room'+room).emit('secondPlayer',{name : splayer.name, email : splayer.email});
        socket.join('room' + room);
        var fplayer = users.find(user => user.id === parseInt(rooms[room].firstPlayer));
        socket.emit('secondPlayer', {name : fplayer.name, email: fplayer.email});
        rooms[room].secondPlayer = token;
        rooms[room].state = true;
        room++;
    }
    else {
        socket.join('room' + room);
    }
    myroom = room;

    socket.on('disconnect', function(){
        console.log('disconnected: ' + token);
    })
});

http.listen(3000, function(){
    console.log("Server running on 3000")
});
