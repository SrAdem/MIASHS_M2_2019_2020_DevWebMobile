require('dotenv').config();

// express + socketio + jsonwebtoken
var express = require('express');
var app = express();

var http = require('http');
var server = http.createServer(app);
var socketioJwt = require('socketio-jwt');
var io = require("socket.io").listen(server);
var jwt = require('jsonwebtoken');
var htmlspecialchars = require('htmlspecialchars');
//database + secur
var mongoose = require('mongoose');
require('./mongoCo');
var bcrypt = require('bcryptjs');

//Models
require('./model/roomModel');
require('./model/userModel');
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
app.use(express.static(__dirname.slice(0,-7)+'Client\\www'));
app.set('views', __dirname.slice(0,-7) + '\\Client\\www')
var engine = require('consolidate');
app.engine('html', engine.mustache);
app.set('view engine', 'html');

/*Pour avoir accès aux données du corps de la requête*/
app.use(express.urlencoded({ extended: true }));

/*Gestion du routage*/
//Si l'utilisateur est déjà connecté, il est redirigé directement vers la page de jeu. Sinon il va à la pge d'accueil.
app.get('/', function(req, res)
{
    res.send("slt");
    console.log("slt")
    if(req.session.userId){
        res.redirect('/jeuDame');
    }else{
        res.render('index.html');
    }
});

//post pour l'inscription d'un joueur
app.post('/inscription', function(req, res,)
{
    console.log("sl")
    //On utilise htmlspecialchars pour éviter l'injection.
    var name = htmlspecialchars(req.body.name);
    var email = htmlspecialchars(req.body.email);
    var password = htmlspecialchars(req.body.password);
    //On vérifie d'abord s'il y a toute les informations nécessaire à l'inscription. Sinon, on r'envoie une erreur.
    if(name && email && password){
        User.findOne({email : email}) //On cherche l'email dans la base de donnée car il sert d'identifiant (clé unique).
            .then ((user) => {
            if(user) { //Si l'email est déjà utilisé, on prévient l'utilisateur.
                return res.render("index.html", {message: "L'utilisateur existe déjà", inscription : true});
            }
            else{ //Sinon on l'ajoute à la base de donnée en lui indiquant que son compté à bien était crée.
                var newUser = new User(req.body);
                //On initialise le nombre de parties gagnées à 0 quand le user s'inscrit
                newUser.nbgagnes = 0;
                newUser.password = bcrypt.hashSync(req.body.password, 10); //On crypte son mot de passe pour la base de donnée.
                newUser.save(function(err, user) {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                user.hash_password = undefined;
                return res.render("index.html", {message: "Compte crée avec succes !", inscription : false});
            }
        });
    }
    });
    }  else {
        res.render("index.html", {message: "Erreur d'inscription", inscription : true});
    }
});

//Le "post" pour pouvoir se connecter au jeu et le "get" dans le cas où l'utilisateur souhaite accédé au jeu.
app.get('/jeuDame', function(req, res)
{
    console.log("sl")
    if(req.session.userId){
        User.findOne({_id : req.session.userId}, function(err, user) {
            //On stocke dans le jeton le nombre de parties gagnés par le utilisateur, son nom et son id
            const accessToken = jwt.sign({id : user.id, name : user.name, nbgagnes : user.nbgagnes}, process.env.ACCESS_TOKEN_SECRET);
            res.render('jeuDame.html', {user: user, accessToken: accessToken});
        });
    }else{
        res.render('index.html');
    }
});

app.post('/jeuDame', function(req, res)
{
    console.log("slt")
    var email = htmlspecialchars(req.body.email);
    var password = htmlspecialchars(req.body.password);
    if(email && password){ //On vérifie qu'il y a bien les information nécessaire à la connexion.
        User.findOne({email : email}, //On cherche l'utilisateur dans la base de donnée.
            function(err, user) {
                if (err) throw err;
                if (!user) { //Si l'email n'est pas dans la base de donnée alors on indique à l'utilisateur qu'une information est érroné. 
                    res.render('index.html', {message: 'Email ou mot de passe incorrect'});
                } else if (user) {
                    if (!user.comparePassword(req.body.password)) { //Si le mot de passe n'est pas correct alors on indique à l'utilisateur qu'une information est érroné.
                        res.render('index.html', {message: 'Email ou mot de passe incorrect'});
                    } else { //Si tout est correcte alors on connecte l'utilisateur.
                        req.session.userId = user._id;
                        //On envoie au serveur les donnée de l'utilisateur pour qu'il n'ai pas à faire plusieurs requete.
                        const accessToken = jwt.sign({id : user.id, name : user.name, nbgagnes : user.nbgagnes}, process.env.ACCESS_TOKEN_SECRET);
                        res.render('jeuDame.html', {user: user, accessToken: accessToken});
                    }
                }
            });
    }
    else {
        res.render('index.html', {message: 'Email ou mot de passe incorrect'});
    }
});

//On se déconnect en supprimant la session de l'utilisateur.
app.get('/deconnexion', function(req, res)
{
    if(req.session.userId){
        req.session.destroy();
    }
    res.redirect("/");
});

/****************************** Socket ******************************/
io.sockets.on('connection', socketioJwt.authorize({
    secret: process.env.ACCESS_TOKEN_SECRET,
    timeout: 15000
}, function() {
    console.log("connected");
}));

var currentRoom = 0; //Numéro de la salle
var rooms = []; //Parties en cours
var waitingList = []; //Utilisateurs en attente

//Il faut bien distinguer { token, socket } de l'utilisateur courrant et { token, socket } de son adversaire.

/**
 * Quand l'utilisateur est connecté sur sa session et sur la page du jeu.
 */
io.on('authenticated', function (socket) {
    console.log("connecte");
    var mysocket = socket;
    var mytoken = socket.decoded_token;
    var myInitWins = mytoken.nbgagnes;
    mysocket.emit('updateWins', mytoken.nbgagnes); //On envoie le nombre de victoire du joueur
  
    //Regarde si l'utilisateur est déjà sur une table
    var myroom = rooms.find(room => (room.firstPlayer.token.id === mytoken.id || room.secondPlayer.token.id === mytoken.id));
    if(myroom) { //Si l'utilisateur est déjà sur une table :
        //On identifie si l'utilisateur est le firstPlayer ou le scondPlayer de la 'room' pour mettre à jour token et socket. 
        //!!!!! Utile si l'utilisateur refresh sa page volontairement.
        //De plus on enregistre les information du secondPlayer pour pouvoir les envoyer à l'utilisateur (nom de son adversaire)
        var splayer;
        var playerID;
        if (myroom.firstPlayer.token.id === mytoken.id) {
            myroom.firstPlayer.token = mytoken;
            myroom.firstPlayer.socket = mysocket;
            splayer = myroom.secondPlayer;
            playerID = "Joueur1";
        }
        else {
            myroom.secondPlayer.token = mytoken;
            myroom.secondPlayer.socket = mysocket;
            splayer = myroom.firstPlayer;
            playerID = "Joueur2";
        }
        //L'utilisateur rejoins sa "room" et recoit les informations de son adversaire.
        mysocket.join('room'+myroom.room);
        mysocket.emit('secondPlayer', {name : splayer.token.name, nbgagnes : splayer.token.nbgagnes}, playerID);
        splayer.socket.emit('needGameState') // On demande l'état du jeu à l'adversaire.
    }

    /**
     * L'utilisateur à recu une demande de l'état du jeu.
     */
    mysocket.on('gameState', function(board, otherPlayerTurn, pawns) {
        //On prend la joueur qui a besoin de l'état du jeu pour lui envoyer.
        myroom = rooms.find(room => (room.firstPlayer.token.id === mytoken.id || room.secondPlayer.token.id === mytoken.id));
        otherPlayer = (myroom.firstPlayer.token === mytoken) ? myroom.secondPlayer : myroom.firstPlayer ; 
        otherPlayer.socket.emit('gameStateSend', board, otherPlayerTurn, pawns);
    })

    /**
     * L'utilisateur demande à affronter quelqu'un.
     */
    mysocket.on('findGame', function() {
        //S'il n'y a personne à affronter, alors on met l'utilisateur dans la file d'attente.
        //On enregistre bien son token et socket pour pouvoir obtenir les informations utile du joueur et la socket.
        //Utile pour pouvoir lui envoyer des informations en cas de besoin (pour lui dire qu'il a un adversaire, lui dire qui est son adversaire)
        if(waitingList.length === 0) {
            waitingList.push({token : mytoken, socket : mysocket});
        }
        //S'il y a quelqu'un à affronter
        else {
            //On fait en sorte que chaque joueur a acces aux informations de l'autre joueur et qu'ils entrent dans la même "room"
            var otherPlayer = waitingList.pop();
            otherPlayer.socket.emit('secondPlayer',{name : mytoken.name, nbgagnes : mytoken.nbgagnes}, "Joueur1");
            otherPlayer.socket.join('room' + currentRoom);
            mysocket.emit('secondPlayer',{name : otherPlayer.token.name, nbgagnes : otherPlayer.token.nbgagnes}, "Joueur2");
            mysocket.join('room' + currentRoom);
            //on enregistre la partie dans la liste des "rooms", parties en cours.
            myroom = {room : currentRoom, firstPlayer : otherPlayer, secondPlayer : {token : mytoken, socket : mysocket} }
            rooms.push( myroom );
            currentRoom++;
        }
    })

    /**
     * Envoyé le mouvement d'un joueur à l'autre joueur
     */
    mysocket.on('movePion', function(pawn, move) {
        myroom = rooms.find(room => (room.firstPlayer.token.id === mytoken.id || room.secondPlayer.token.id === mytoken.id));
        var otherPlayer = (myroom.firstPlayer.token === mytoken) ? myroom.secondPlayer : myroom.firstPlayer ;
        otherPlayer.socket.emit("receiveMove", pawn, move);
    })

    /**
     * Fin de la partie, on enregistre la partie dans la base de donnée et on informe les joueurs de leur victoire/défaite
     * Celui qui appel cette fonction est le perdant
     */
    mysocket.on('endGame', function() {
        //On récupère la salle des deux joueurs
        myroom = rooms.find(room => (room.firstPlayer.token.id === mytoken.id || room.secondPlayer.token.id === mytoken.id));
        //Pour en extraire le token et la socket de l'autre joueur
        var otherPlayer = (myroom.firstPlayer.token === mytoken) ? myroom.secondPlayer : myroom.firstPlayer ;
        //On créer le résultat pour l'insérer dans la base de donnée
        otherPlayer.token.nbgagnes = otherPlayer.token.nbgagnes + 1; //On incrément le nombre de victoire du gagnant
        var newRoom = new Room({room : myroom.room, firstPlayer : myroom.firstPlayer.token.id, secondPlayer : myroom.secondPlayer.token.id, winner : otherPlayer.token.id});
        //On l'enregistre dans la base de donnée
        newRoom.save(function(err, room) {
            if (err) {
                console.log("erreur d'insertion des résultats !!");
            } else {
                //Et on affiche les résultats aux utilisateurs
                mysocket.emit("results", false);
                otherPlayer.socket.emit("results", true); 
                otherPlayer.socket.emit("updateWins", otherPlayer.token.nbgagnes) //On dit au gagnant de mettre à jour son interface
            }
        });
        rooms.splice(rooms.indexOf(myroom));
    })

    /**
     * Quand l'utilisateur se déconnecte on le reture de la salle d'attente s'il est présent dans celui-ci.
     */
    mysocket.on('disconnect', function(){
        var pos = waitingList.indexOf({token : mytoken, socket : mysocket});
        waitingList.splice(pos,1);
        if(myInitWins != mytoken.nbgagnes) { //Si l'utilisateur à gagner des parties avant de quitter on met a jour la base de donnée
            User.findOne({_id : mytoken.id}, function(err, user) { 
                user.nbgagnes = mytoken.nbgagnes;
                user.save();
            });
        }
    })
});

server.listen(12345);
