/**
 * Ajout d'évenement aux pions
 */
var eventOnChoosablePawn = function () {
    movablePawnPlayer.forEach((pawn, index) => {
        let svg = document.getElementById("lig" + pawn.pawn.i + " col" + pawn.pawn.j);
        svg.setAttribute("onclick", "selectPawn("+index+")");
        svg.setAttribute("class", "pionsJouables");
    });
}

/**
 * Ajout d'évenement aux cases
 * @param {*} indexOfPawn : index du pion pour prendre les cases où il peut aller
 */
var eventOnChoosableSquare = function (indexOfPawn) {
    movablePawnPlayer[indexOfPawn].possibleMove.forEach( (move, index) => {
        let svg = document.getElementById("Lig" + move.i + " Col" + move.j);
        svg.setAttribute("onclick", "selectSquare(" + index + ", " + indexOfPawn + ")");
        svg.setAttribute("class", "casesJouables");
    });
}

/**
 * Retire toutes les class casesJouables
 */
var cleanSquares = function () {
    var jouab = document.getElementsByClassName("casesJouables");
    if (jouab.length > 0) {
        while (jouab.length != 0) {
            jouab[0].removeAttribute("class");
        }
    }
}

/**
 * Retire toutes les class pionsJouables
 */
var cleanPawns = function () {
    var jouab = document.getElementsByClassName("pionsJouables");
    if (jouab.length > 0) {
        while (jouab.length != 0) {
            jouab[0].removeAttribute("class");
        }
    }
}

/**
 * Evenement d'un pion
 * @param {int} indexOfPawn : index du pion dans la table
 */
var selectPawn = function (indexOfPawn) {
    newPawn = movablePawnPlayer[indexOfPawn]; // On prend le pion choisi dans le tableau movablePawnPlayer
    //Pour faire clignoter le pion choisi
    if (selectedPawn != undefined) {
        document.getElementById("lig"+ selectedPawn.pawn.i + " col" + selectedPawn.pawn.j).removeAttribute("class");
        removeSquareEvents(selectedPawn);
    }
    document.getElementById("lig"+ newPawn.pawn.i + " col" + newPawn.pawn.j).setAttribute("class", "pionActif");
    selectedPawn = newPawn;
    
    cleanSquares();
    eventOnChoosableSquare(indexOfPawn); // On ajoute un évenement à toutes les cases où le pion peut aller.
}

/**
 * movablePawnPlayer est la table contenant ce qu'il faut (pion et les déplacement du pion)
 * Evenement d'une case
 * @param {int} indexOfMove : index de la case choisi dans la table du pion choisi dans movablePawnPlayer
 * @param {int} indexOfPawn : index du pion dans le tableau
 */
var selectSquare = function(indexOfMove, indexOfPawn) {
    pawn = movablePawnPlayer[indexOfPawn]; // On prend le pion choisi
    move = pawn.possibleMove[indexOfMove]; // On trouve la case sur laquel le joueur à clique sur le tableau de mouvement possible du pion
    var eat = movePawn(pawn.pawn, move); // On bouge le pion
    cleanSquares();
    cleanPawns();
    removePawnEvents(); // On supprime les évenement !
    if(eat != false) { //Si le pion a manger un autre pion alors 
        movablePawnPlayer = anotherMoveWithEat(joueur, eat.i, eat.j); //On cherche s'il y a encore moyen de manger un autre pion avec le même pion qui a manger.
        console.log(movablePawnPlayer);
        if(movablePawnPlayer.length == 0) endTurn(); // S'il n'y a pas de possibilité, alors on fini le tour
        else eventOnChoosablePawn(); //Sinon on modifie re ajoute des évenements au pion et aux déplacements possible.
    }
    else { //Si c'est un mouvement simple alors on funu le tour.
        endTurn();
    }
}

/**
 * Fonction qui supprime les évenements sur les pions
 */
var removePawnEvents = function() {
    //Parcours toute la table des possibilitées et supprime l'évènement.
    movablePawnPlayer.forEach((pawn) => { //Chaque pion
        let pawnSVG = document.getElementById("lig" + pawn.pawn.i + " col" + pawn.pawn.j);
        //Si c'est un pion qu'on a pas déplacé, on supprime son évenement
        if (pawnSVG != null) document.getElementById("lig" + pawn.pawn.i + " col" + pawn.pawn.j).removeAttribute("onclick"); 
        removeSquareEvents(pawn);
    });
}

/**
 * Supprime les évenements des cases lié au pion.
 * @param {pawn} pawn 
 */
var removeSquareEvents = function(pawn) {
    pawn.possibleMove.forEach((move) => { //On supprime tout les évents des mouvements possible d'un pion
        svg = document.getElementById("Lig" + move.i + " Col" + move.j).removeAttribute("onclick");
    });
}

/**
 * Fonction de déplacement d'un pion
 * @param {int, int} pawn : contient le i et j du pion
 * @param {int, int} move : contient le i et j de la case ciblé
 */
var movePawn = function(pawn, move) {
    let i = pawn.i;
    let j = pawn.j;
    let pawnID = plateau[i][j]; // On prend le pion de sa position
    let newi = move.i;
    let newj = move.j;
    let eatMove //= (newi == i+2 ||newi == i-2)? true : false; // On regarde si c'est un mouvement qui mange un pion
    let eatI = -1;
    let eatJ = -1; 

    if(pawnID > 0) {// Si c'est une dame
        //on cherche la direction 
        eatI = (newi-i>=1)?1:-1; 
        eatJ = (newj-j>=1)?1:-1;
        //S'il y a un pion entre la position de départ et la destination
        while(i<=9 && i>=0 && j<=9 & j>=0) {
            if(i == newi && j == newj) break; //Si à la position ciblé, c'est qu'il n'y a pas de pion au milieu
            if(plateau[i][j]!=pawnID && plateau[i][j]!=pawnID+2 && plateau[i][j]!=0) { 
                eatMove = true;
                eatI = i;
                eatJ = j;
                break;
            }
            i= i+eatI;
            j= j+eatJ;
        }
    }
    //On reprend les position du pion
    i = pawn.i;
    j = pawn.j;
    
    //Sur le plateau !
    plateau[i][j]=0; // On met la position à 0

    //si un pion blanc atteint le haut du plateau ou un pion noir le bas
    if( (pawnID == 1 && newi == 0) || (pawnID == 2 && newi == 9) ) {
        plateau[newi][newj]=pawnID +2 ; // Il devient une dame 
    }
    else {
        plateau[newi][newj]=pawnID; // Sinon, on place le pion à sa nouvelle position
    }

    //sur la grille svg
    let pawnSVG = document.getElementById("lig" + i + " col" + j); // On prend le pion svg du plateau
    gameGrid.removeChild(pawnSVG); // On le supprime
    var newPawnSVG = pionage(newi, newj); // On crée un nouveau pion
    gameGrid.appendChild(newPawnSVG); // On l'ajoute sur le plateau

    //Si c'est un mouvement qui mange un pion alors
    if(eatMove) {                
        //On le supprime du plateau
        plateau[eatI][eatJ]=0;
        (pawnID == 1 || pawnID == 3) ? blackPlayerNbPawn -- : whitePlayerNbPawn ;
        //On supprime son svg
        let eatPawnSVG = document.getElementById("lig" + eatI + " col" + eatJ); // On prend le pion svg du plateau
        gameGrid.removeChild(eatPawnSVG);
        return {i : newi, j : newj}; //Si le pion a mangé alors il envoie sa nouvelle position
    }
    return false; //Sinon renvoi false
}