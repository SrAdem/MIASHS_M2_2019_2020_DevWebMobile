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

/* Fonctions js de la page */

//Chercher un joueur peut-être en attente de celui-ci
function findGame() {
  document.getElementById("search-player").setAttribute("style","display:block");
  document.getElementById("result").setAttribute("style","display:none");
  socket.emit('findGame');
}

//Le second joueur est présent, on affiche ce qu'il faut
socket.on('secondPlayer', function(autherPlayer) {
  document.getElementById("search-player").setAttribute("style","display:none");
  document.getElementById("beforeGameButtons").setAttribute("style","display:none");
  document.getElementById("inGameButtons").setAttribute("style", "display:block");
  document.getElementById("container").setAttribute("style", "display:block");

  var player2div = document.getElementById("readyPlayerTwo");
  player2div.innerHTML = "<b>" + autherPlayer.name + "</b>";
  player2div.setAttribute("style", "display:block");
});

//Mouvement
function move(id) {
  caseSelct(id);
  socket.emit('movePion', selectedPion, id);
  suppEvenementClick();
  console.log("move");
}

//Recois un mouvment
socket.on('receiveMove', function(selectedPion, destination) {
  console.log(selectedPion, destination);
  moveEffectuer(selectedPion, destination);
  AjoutEvenementClick();
  console.log("receiveMove");
})

//Mouvement gagnant
function IWin(){
  socket.emit('endGame');
}

//Résultats
socket.on('results', function(win) {
  document.getElementById("beforeGameButtons").setAttribute("style","display:block");
  document.getElementById("inGameButtons").setAttribute("style", "display:none");
  document.getElementById("container").setAttribute("style", "display:none");
  document.getElementById("readyPlayerTwo").setAttribute("style", "display:none");

  console.log("in" + win );
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

//Retour à l'interface de base