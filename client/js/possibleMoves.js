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
            if(plateau[i][j] == playerID) {
                //On regarde s'il peut bouger
                //Si un pion peut manger, pas la peine de calculer le déplacement simple d'un pion
                if(movablePawnEat.length == 0) addToPossibleMoveOfPawn(possibleMove(i,j,-1,+1));
                //Calcule si un pion peut manger
                addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,-1,+1));

                if(movablePawnEat.length == 0) addToPossibleMoveOfPawn(possibleMove(i,j,-1,-1));
                addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,-1,-1));
            
                if(movablePawnEat.length == 0) addToPossibleMoveOfPawn(possibleMove(i,j,+1,-1));
                addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,+1,-1));

                if(movablePawnEat.length == 0) addToPossibleMoveOfPawn(possibleMove(i,j,+1,+1));
                addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,+1,+1));
                
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
            else if (plateau[i][j] == playerID+2) {
                let dame = possibleMoveDame(playerID,i,j);
                if(dame.onlyEat) {
                    movablePawnEat.push({pawn : {i,j}, possibleMove : dame.dameMoves});
                }
                else if(dame.dameMoves.length != 0){
                    movablePawn.push({pawn : {i,j}, possibleMove : dame.dameMoves});
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
    moveI = i + id;
    moveJ = j + jd;
    if(moveI < 0 || moveI > 9 || moveJ < 0 || moveJ > 9) return null; // Pour ne pas sortir de la limite
    let positionToCheck = plateau[moveI][moveJ]; // une position adjascente 
    let pawn = plateau[i][j]; //contenu de la position de départ

    //Si on monte sur le plateau (id = -1) et que le pion est BLANC, on descend (id = +1) et que le pion est NOIR
    //ou que le pion est une dame alors on peut regarder la case si elle est libre ou non
    if(positionToCheck == 0) {
        if ( (id < 0 && pawn == 1) || (id > 0 && pawn == 2) || pawn > 2) { 
            return {i : moveI, j : moveJ};
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
    inext = i+id;
    jnext = j+jd;
    if(inext < 0 || inext > 9 || jnext < 0 || jnext > 9) return null;
    positionToCheck = plateau[inext][jnext]; // une position adjascente 
    // position du pion adverse = plateau[i+ie][j+je]
    // donc position a vérifier : 
    checkPositionI = inext+id;
    checkPositionJ = jnext+jd;
    if(checkPositionI < 0 || checkPositionI > 9 || checkPositionJ < 0 || checkPositionJ > 9) return null; // Pour ne pas sortir de la limite
    //Si la position verifié (+1) n'est pas un pion du joueur et que la position derrière (+2) est vide, alors le mouvement est possible
    if(positionToCheck != playerID && positionToCheck != playerID+2 && positionToCheck != 0 && plateau[checkPositionI][checkPositionJ] == 0) {
            return {i : checkPositionI, j : checkPositionJ}; //Si la position +2 est libre et que laposition +1 est un pion adverse alors on peut manger
    }
    return null;
}

/**
 * 
 * @param {int} playerID : identifiant du joueur
 * @param {int} pi : i pion du joueur
 * @param {int} pj : j pion du joueur
 */
var possibleMoveDame = function(playerID,pi,pj) {
    let dameMoves = []; //Les mouvements possible
    let dameMovesEat = [];
    let onlyEat = false; // pour limiter les mouvement qu'à ceux qui mange un autre pion
    let i = pi; 
    let j = pj;
    //parcours du pion au limite du plateau
    while(i>=0 && j>=0 && i<=9 && j<=9) {
        if(i-1 < 0 || j-1 < 0) break; // si limite on quitte +1 / -1
        let positionToCheck = plateau[i-1][j-1];
        if(positionToCheck == 0 && !onlyEat) { //si la position est vide et qu'on n'est pas obligé de manger on l'ajoute
            dameMoves.push({i: i-1, j: j-1});
        } 
        //Si c'est un pion du joueur alors on s'arrete
        else if(positionToCheck == playerID ||positionToCheck == playerID+2) {
            break;
        }
        else if(i-2 < 0 || j-2 < 0) break; // si limite on quitte +2 / -2 obligé apres pour pouvoir au moins vérifié le premier if de la série
        //S'il y a un pion adverse sur le trajet et qu'il ne peut pas être mangé
        else if(positionToCheck != playerID && positionToCheck != playerID+2 && plateau[i-2][j-2] != 0) {
            break;
        }
        //S'il y a un pion adverse qu'on peut manger
        else if(positionToCheck != playerID && positionToCheck != playerID+2 && positionToCheck != 0 && plateau[i-2][j-2] == 0) {
            if (!onlyEat) {
                onlyEat = true;
                dameMoves = [];
            }
            dameMoves.push({i: i-2, j: j-2});
            break;
        }
        i--;j--;
    }
    i = pi;
    j = pj;
    while(i>=0 && j>=0 && i<=9 && j<=9) {
        if(i+1 > 9 || j-1 < 0) break;
        let positionToCheck = plateau[i+1][j-1];
        if(positionToCheck == 0 && !onlyEat) {
            dameMoves.push({i: i+1, j: j-1});
        }
        else if(positionToCheck == playerID ||positionToCheck == playerID+2) {
            break;
        }
        else if(i+2 > 9 || j-2 < 0) break;
        else if(positionToCheck != playerID && positionToCheck != playerID+2 && plateau[i+2][j-2] != 0) {
            break;
        }
        else if(positionToCheck != playerID && positionToCheck != playerID+2 && positionToCheck != 0 && plateau[i+2][j-2] == 0) {
            if (!onlyEat) {
                onlyEat = true;
                dameMoves = [];
            }
            dameMoves.push({i: i+2, j: j-2});
            break;
        }
        i++;j--;
    }
    i = pi;
    j = pj;
    while(i>=0 && j>=0 && i<=9 && j<=9) {
        if(i-1 < 0 || j+1 > 9) break;
        let positionToCheck = plateau[i-1][j+1];
        if(positionToCheck == 0 && !onlyEat) {
            dameMoves.push({i: i-1, j: j+1});
        }
        else if(positionToCheck == playerID ||positionToCheck == playerID+2) {
            break;
        }
        else if(i-2 < 0 || j+2 > 9) break;
        else if(positionToCheck != playerID && positionToCheck != playerID+2 && plateau[i-2][j+2] != 0) {
            break;
        }
        else if(positionToCheck != playerID && positionToCheck != playerID+2 && positionToCheck != 0 && plateau[i-2][j+2] == 0) {
            if (!onlyEat) {
                onlyEat = true;
                dameMoves = [];
            }
            dameMoves.push({i: i-2, j: j+2});
            break;
        }
        i--;j++;
    }
    i = pi;
    j = pj;
    while(i>=0 && j>=0 && i<=9 && j<=9) {
        if(i+1 > 9|| j+1 > 9) break;
        let positionToCheck = plateau[i+1][j+1];
        if(positionToCheck == 0 && !onlyEat) {
            dameMoves.push({i: i+1, j: j+1});
        }
        else if(positionToCheck == playerID ||positionToCheck == playerID+2) {
            break;
        }
        else if(i+2 > 9 || j+2 > 9) break;
        else if(positionToCheck != playerID && positionToCheck != playerID+2 && plateau[i+2][j+2] != 0) {
            break;
        }
        else if(positionToCheck != playerID && positionToCheck != playerID+2 && positionToCheck != 0 && plateau[i+2][j+2] == 0) {
            if (!onlyEat) {
                onlyEat = true;
                dameMoves = [];
            }
            dameMoves.push({i: i+2, j: j+2});
            break;
        }
        i++;j++;
    }
    // if(onlyEat) return {onlyEat, dameMoves : dameMovesEat};
    return {onlyEat,dameMoves};
}

/**
 * Fonction qui regarde si le pion ayant mangé un autre pion peut encore manger
 * @param {String} player : si joueur 1 ou 2
 * @param {int} i : position i du pion ayant mangé 
 * @param {int} j : position j du pion ayant mangé
 */
var anotherMoveWithEat = function(player, i, j) {
    let playerID = (player == "Joueur1") ? 1 : 2 ;
    let movablePawnEat = []
    let possibleMoveOfPawnWithEat = [];
    let addToPossibleMoveOfPawnWithEat = function (move) { //petite fonction pour ne pas inséré des éléments null
        if (move != null) possibleMoveOfPawnWithEat.push(move);
    }

    //Si le pion est une dame
    if(plateau[i][j] > 2 ){
        let dame = possibleMoveDame(playerID,i,j);
        if(dame.onlyEat) {
            movablePawnEat.push({pawn : {i,j}, possibleMove : dame.dameMoves});
            return movablePawnEat;
        }
    }
    //Sinon
    //Calcule si le pion peut encore manger
    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,-1,-1));
    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,-1,+1));
    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,+1,-1));
    addToPossibleMoveOfPawnWithEat(possibleMoveWithEat(playerID,i,j,+1,+1));
    // si oui on envoie un objet de même model que movablePawn()
    if(possibleMoveOfPawnWithEat.length != 0) movablePawnEat.push({ pawn : {i,j}, possibleMove : possibleMoveOfPawnWithEat}); 
    return movablePawnEat;
}