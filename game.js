var filsNoeud = gameGrid.childNodes;
//tableau pour gérer les tour de jeu, 
var joueur = "Joueur1";
//garder une trace du pion qui a été séléctionner 
var elemClignote;
var localGame = true;
var movablePawnPlayer;

var turnOf = function(playerTurn) {
    movablePawnPlayer = movablePawn(playerTurn);
    console.log(movablePawnPlayer);
    eventOnChoosablePawn();
}

var endTurn = function() {
    if(localGame) {
        joueur = (joueur=="Joueur1")?"Joueur2":"Joueur1";
        turnOf(joueur);
    }
}

turnOf("Joueur1");