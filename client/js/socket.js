/* Communication avec le serveur */
var socket = io();
socket.on('connect', function () {
  console.log('Connection...');
  socket.emit('authenticate', {token: token});
});

socket.on('authenticated', function () {
  console.log('Authenticated');
});

socket.on('unauthorized', function (data) {
  console.log('Unauthorized, error msg: ' + data.message);
});

socket.on('disconnect', function () {
  console.log('Disconnected');
});

//Met à jour l'affichage du nombre de victoire
socket.on('updateWins', function (wins) {
  document.getElementById('partiesgagnes').innerHTML = wins;
});

/* Fonctions js de la page */

//L'adversaire me demande l'état du jeu
socket.on('needGameState', function() {
  // Si c'est j'ai des pions à déplacer alors c'est mon tour sinon c'est au tour de mon adversaire
  var otherPlayerTurn = (movablePawnPlayer != undefined || movablePawnPlayer.length == 0) ? true : false ;
  // J'envoie coté serveur le plateau et un booleen pour le tour de mon adversaire 
  socket.emit('gameState', plateau, otherPlayerTurn, {white : whitePlayerNbPawn, black : blackPlayerNbPawn});
})

socket.on('gameStateSend', function(board, myturn, pawns) {
  initGame(board);
  whitePlayerNbPawn = pawns.white;
  blackPlayerNbPawn = pawns.black;
  if(myturn) endTurn(joueur);
})

//Chercher un joueur peut-être en attente de celui-ci
function findGame() {
  document.getElementById("search-player").setAttribute("style","display:block");
  document.getElementById("result").setAttribute("style","display:none");
  socket.emit('findGame');
}

//Le second joueur est présent, on affiche ce qu'il faut
socket.on('secondPlayer', function(autherPlayer,iAmThePlayer) {
  onlineGame(iAmThePlayer);
  document.getElementById("search-player").setAttribute("style","display:none");
  document.getElementById("beforeGameButtons").setAttribute("style","display:none");
  document.getElementById("inGameButtons").setAttribute("style", "display:block");
  document.getElementById("container").setAttribute("style", "display:block");

  var player2div = document.getElementById("readyPlayerTwo");
  player2div.innerHTML = "<b>" + autherPlayer.name + "</b><br/>Nombre de partis gagnées: " + autherPlayer.nbgagnes;
  player2div.setAttribute("style", "display:block");
});

//Mouvement
function sendMove(pawn, move) {
  socket.emit('movePion', pawn, move);
}

//Recois un mouvment
socket.on('receiveMove', function(pawn, move) {
  var anotherMove = movePawn(pawn, move);
  // if (!anotherMove) turnOf(joueur);
  var player = (joueur=="Joueur1")?"Joueur2":"Joueur1";
  if(anotherMove != false) { //Si le pion a manger un autre pion alors 
    movablePawnPlayer = anotherMoveWithEat(player, anotherMove.i, anotherMove.j); //On cherche s'il y a encore moyen de manger un autre pion avec le même pion qui a manger.
    if(movablePawnPlayer.length == 0) endTurn(joueur); // S'il n'y a pas de possibilité, alors on fini le tour
  }
  else endTurn(joueur);
})

//Mouvement de fin
function ILost() {
  if (!localGame) socket.emit('endGame'); //Celui qui envoie est le perdant !
  else surrend();
}

//Résultats
socket.on('results', function(win) {
  document.getElementById("beforeGameButtons").setAttribute("style","display:block");
  document.getElementById("inGameButtons").setAttribute("style", "display:none");
  document.getElementById("container").setAttribute("style", "display:none");
  document.getElementById("readyPlayerTwo").setAttribute("style", "display:none");

  var resultSpan = document.getElementById("result");
  if(win) {
    resultSpan.setAttribute("style","display:block; background-color:green");
    resultSpan.innerHTML="Vous avez gagné !"; 
  }
  else {
    resultSpan.setAttribute("style","display:block; background-color:red");
    resultSpan.innerHTML="Vous avez Perdu :'("; 
  }
})
