var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var User = require('../model/user');
//var bcrypt = require('bcrypt');
var users = [];
app.get("/", function(req, res){
    res.sendFile(__dirname.slice(0,-7)+'client/authUser.html');
});

io.on('connection', function(socket){
    console.log('a user is connected');


    socket.on('addUser', function (name, email, pwd) {
        users.push({
            name: name,
            email: email,
            pwd: pwd
        });
        io.emit('userRegistred', users);
    });

    socket.on('logged', function () {
        io.emit('connected')
    });


    socket.on('disconnect', function (){
        console.log('a user is disconnected');
    });
    socket.on('chat message', function (msg){
        console.log('message recu : ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(3000, function(){
    console.log("Server running on 3000")
});
