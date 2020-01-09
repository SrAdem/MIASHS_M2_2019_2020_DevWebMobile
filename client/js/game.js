var joueur = "Joueur1"; // pour identifier le joueur en ligne ou pour changer de joueur en local
var selectedPawn; //garder une trace du pion qui a été séléctionner
var localGame; //Permet de savoir si on joue en local ou en ligne
var movablePawnPlayer; //Contiendra tout les mouvement possible [ {pion , mouvements du pion}, {pion, mo...}, ...]
                            //                                      ||           ||
                            //                                     {i, j}       [{i,j}, {i,j}, ... ] mouvements possible 
var whitePlayerNbPawn; //Nombre de pion blanc
var blackPlayerNbPawn; //Nombre de pion noir
/**
 * Débute le tour du joueur
 * @param {string} playerTurn : identifiant du joueur
 */
var turnOf = function(playerTurn) {
    movablePawnPlayer = movablePawn(playerTurn); // On enregistre tout les mouvements possible du joueur 
    eventOnChoosablePawn(); //On ajoute l'évènement de clique sur tout les pions pouvant bouger.
}

/**
 * A la fin d'un tour, cette fonction est appelé. Il permet de finir le jeu ou de changer de joueur.
 * En mode en ligne, player est null quand le joueur courant appel la fonction est est égal au nom du joueur 
 * qui va jouer pour appeller la fonction turnOf lui permettant de jouer
 */
var endTurn = function(player) {
    if(whitePlayerNbPawn == 0) {
        if(player == "Joueur1") ILost();
    }
    else if(blackPlayerNbPawn == 0) {
        if(player == "Joueur2") ILost();
    }
    else if(localGame) {
        joueur = (joueur=="Joueur1")?"Joueur2":"Joueur1";
        turnOf(joueur);
    }
    else if(!localGame && player) {
        turnOf(player);
    }
}

/**
 * permettra de lancer une partie en local
 */
function playLocalGame() {
    initGame();
    document.getElementById("beforeGameButtons").setAttribute("style","display:none");
    document.getElementById("inGameButtons").setAttribute("style", "display:block");
    document.getElementById("container").setAttribute("style", "display:block");
    localGame = true;
    joueur = "Joueur1";
    whitePlayerNbPawn = 20;
    blackPlayerNbPawn = 20;
    turnOf(joueur);
}

/**
 * permettra de lancer une partie en ligne
 * @param {strin} player : identifiant du joueur
 */
var onlineGame = function (player) {
    initGame();
    joueur = player;
    localGame = false;
    whitePlayerNbPawn = 20;
    blackPlayerNbPawn = 20;
    if (joueur == "Joueur1") turnOf(joueur);
}

function surrend () {
    if(localGame) {
        var winner = (joueur=="Joueur1")?"Joueur2":"Joueur1";
        document.getElementById("beforeGameButtons").setAttribute("style","display:block");
        document.getElementById("inGameButtons").setAttribute("style", "display:none");
        document.getElementById("container").setAttribute("style", "display:none");
        document.getElementById("readyPlayerTwo").setAttribute("style", "display:none");
      
        var resultSpan = document.getElementById("result");
        resultSpan.setAttribute("style","display:block; background-color:green");
        resultSpan.innerHTML="Vous avez gagné " + winner + " !";
    }
}