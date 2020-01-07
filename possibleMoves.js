/**
 * 
 * @param {String} player : Si joueur 1 ou 2 
 */
var movablePawn = function(player) {
    let movablePawn = [];
    let movablePawnEat= [];
    let possibleMoveOfPawn = [];
    let possibleMoveOfPawnWithEat = [];
    let playerID = (player == "Joueur1") ? 1 : 2 ;
    let addToPossibleMoveOfPawn = function (move){ //Petite fonction qui teste si la mouvement est null ou pas.
        if (move != null) possibleMoveOfPawn.push(move);
    }
    let addToPossibleMoveOfPawnWithEat = function (move) {
        if (move != null) possibleMoveOfPawnWithEat.push(move);
    }
    
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            //Si le pion est la couleur de pion de l'utilisateur (ou la dame du joueur)
            if(plateau[i][j] == playerID || plateau[i][j] == playerID +2 ) {
                //On regarde s'il peut bouger
                //ligne superieur
                if(i!=0) {
                    //Si un pion peut manger, pas la peine de calculer le déplacement simple d'un pion
                    if(movablePawnEat.length == 0) addToPossibleMoveOfPawn(possibleMove(i,j,-1,+1));
                    //Calcule si un pion peut manger
                    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,-1,+1));

                    if(movablePawnEat.length == 0) addToPossibleMoveOfPawn(possibleMove(i,j,-1,-1));
                    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,-1,-1));
                }
                //ligne inferieur
                if(i!=9) {
                    if(movablePawnEat.length == 0) addToPossibleMoveOfPawn(possibleMove(i,j,+1,-1));
                    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,+1,-1));

                    if(movablePawnEat.length == 0) addToPossibleMoveOfPawn(possibleMove(i,j,+1,+1));
                    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,+1,+1));
                }
                //Si un pion peut manger, on le garde, le reste on oublie, sinon on grade les mouvements simple.
                if(possibleMoveOfPawnWithEat.length != 0) {
                    movablePawnEat.push({pawn : {i,j}, possibleMove : possibleMoveOfPawnWithEat});
                    possibleMoveOfPawnWithEat = [];
                }
                else if(possibleMoveOfPawn.length != 0) {
                    movablePawn.push({pawn : {i,j}, possibleMove : possibleMoveOfPawn});
                    possibleMoveOfPawn = [];
                }
            }
        }
    }
    //Si un pion peut manger, on retourne les mouvements pour manger sinon on retourne les mouvemetns simple.
    if(movablePawnEat.length != 0) return movablePawnEat;
    return movablePawn;
}

/**
 * Fonction qui vérifie si on peut bouger le pion
 * @param {int} playerID : identifiant du joueur 
 * @param {int} i : i pion du joueur 
 * @param {int} j : j pion du joueur
 * @param {int} id : i à vérifier (+1 ou -1)
 * @param {int} jd : j à vérifier  (+1 ou -1)
 */
var possibleMove = function(i,j,id,jd) {
    let positionToCheck = plateau[i+id][j+jd]; // une position adjascente 
    let pawn = plateau[i][j]; //contenu de la position de départ

    //Si on monte sur le plateau (id = -1) et que le pion est BLANC, on descend (id = +1) et que le pion est NOIR
    //ou que le pion est une dame alors on peut regarder la case si elle est libre ou non
    if( positionToCheck != undefined && positionToCheck == 0) {
        if ( (id < 0 && pawn == 1) || (id > 0 && pawn == 2) || pawn > 2) { 
            return {i : i+id, j : j+jd};
        }
    }
    return null;
}

/**
 * Fonction qui vérifie si on peut manger le pion de l'adversaire
 * @param {int} playerID : identifiant du joueur 
 * @param {int} i : i pion du joueur 
 * @param {int} j : j pion du joueur
 * @param {int} id : i pion adverse (+1 ou -1)
 * @param {int} jd : j pion adverse  (+1 ou -1)
 */
var possibleMoveWithEat = function(playerID,i,j,id,jd) {
    positionToCheck = plateau[i+id][j+jd]; // une position adjascente 
    // position du pion adverse = plateau[i+ie][j+je]
    // donc position a vérifier : 
    checkPositionI = i+id+id;
    checkPositionJ = j+jd+jd;
    if(positionToCheck != undefined && positionToCheck != playerID && positionToCheck != playerID+2 && positionToCheck != 0
        && plateau[checkPositionI][checkPositionJ] != undefined && plateau[checkPositionI][checkPositionJ] == 0) {
            return {i : checkPositionI, j : checkPositionJ}; //Si la position +2 est libre et que laposition +1 est un pion adverse alors on peut manger
    }
    return null;
}

var anotherMoveWithEat = function(player, i, j) {
    let playerID = (player == "Joueur1") ? 1 : 2 ;
    let movablePawnEat = []
    let possibleMoveOfPawnWithEat = [];
    let addToPossibleMoveOfPawnWithEat = function (move) {
        if (move != null) possibleMoveOfPawnWithEat.push(move);
    }
    
    //Calcule si un pion peut manger
    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,-1,-1));
    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,-1,+1));
    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,+1,-1));
    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,+1,+1));
    if(possibleMoveOfPawnWithEat.length != 0) movablePawnEat.push({ pawn : {i,j}, possibleMove : possibleMoveOfPawnWithEat});
    return movablePawnEat;
}