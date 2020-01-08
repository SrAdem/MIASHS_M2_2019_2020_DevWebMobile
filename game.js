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
    console.log(movablePawnPlayer);
    eventOnChoosablePawn(); //On ajoute l'évènement de clique sur tout les pions pouvant bouger.
}

/**
 * A la fin d'un tour, cette fonction est appelé. Il permet de finir le jeu ou de changer de joueur.
 * TODO : faire attendre le joueur s'il est en ligne
 */
var endTurn = function() {
    if(whitePlayerNbPawn == 0) {
        console.log("black win")
    }
    else if(blackPlayerNbPawn == 0) {
        console.log("white win")
    }
    else if(localGame) {
        joueur = (joueur=="Joueur1")?"Joueur2":"Joueur1";
        selectedPawn = undefined;
        turnOf(joueur);
    }
}

/**
 * permettra de lancer une partie en local
 */
var localGame = function() {
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
    joueur = player;
    localGame = false;
    whitePlayerNbPawn = 20;
    blackPlayerNbPawn = 20;
}

localGame();