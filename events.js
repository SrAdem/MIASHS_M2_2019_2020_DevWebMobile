var eventOnChoosablePawn = function () {
    movablePawnPlayer.forEach((pawn, index) => {
        let svg = document.getElementById("lig" + pawn.pawn.i + " col" + pawn.pawn.j);
        svg.setAttribute("onclick", "selectPawn("+index+")");
    });
}

var eventOnChoosableSquare = function (pawn, indexOfPawn) {
    pawn.possibleMove.forEach( (move, index) => {
        let svg = document.getElementById("Lig" + move.i + " Col" + move.j);
        svg.setAttribute("onclick", "selectSquare(" + index + ", " + indexOfPawn + ")");
    });
}

var selectPawn = function (indexOfPawn) {
    pawn = movablePawnPlayer[indexOfPawn];
    let elemClick = document.getElementById("lig" + pawn.pawn.i + " col" + pawn.pawn.j);
    var couleurPion = elemClick.getAttribute("fill");

    if (elemClignote != undefined) elemClignote.removeAttribute("class");
    elemClick.setAttribute("class", "pionActif");
    elemClignote = elemClick;

    eventOnChoosableSquare(pawn, indexOfPawn);
}

var selectSquare = function(indexOfMove, indexOfPawn) {
    pawn = movablePawnPlayer[indexOfPawn];
    move = pawn.possibleMove[indexOfMove];
    var eat = movePawn(pawn.pawn, move);
    removeEvents();
    if(eat != false) {
        movablePawnPlayer = anotherMoveWithEat(joueur, eat.i, eat.j);
        console.log(movablePawnPlayer);
        if(movablePawnPlayer.length == 0) {
            endTurn();
        }
        eventOnChoosablePawn();
    }
    else {
        endTurn();
    }
}

var removeEvents = function() {
    movablePawnPlayer.forEach((pawn) => {
        let pawnSVG = document.getElementById("lig" + pawn.pawn.i + " col" + pawn.pawn.j);
        if (pawnSVG != null) document.getElementById("lig" + pawn.pawn.i + " col" + pawn.pawn.j).removeAttribute("onclick");
        pawn.possibleMove.forEach((move) => {
            svg = document.getElementById("Lig" + move.i + " Col" + move.j).removeAttribute("onclick");
        });
    });
}

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
        while(i<=9 && i>=0 && j<=9 & j>=0) {
            //S'il y a un pion entre la position de départ et la destination
            if(plateau[i][j]!=pawnID && plateau[i][j]!=pawnID+2 && plateau[i][j]!=0) { 
                eatMove = true;
                eatI = i;
                eatJ = j;
                break;
            }
            if(i == newi && j == newj) break;
            i= i+eatI;
            j= j+eatJ;
        }
    }

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
        //On supprime son svg
        let eatPawnSVG = document.getElementById("lig" + eatI + " col" + eatJ); // On prend le pion svg du plateau
        gameGrid.removeChild(eatPawnSVG);
        return {i : newi, j : newj}; //Si le pion a mangé alors il envoie sa nouvelle position
    }
    return false; //Sinon renvoi false
}