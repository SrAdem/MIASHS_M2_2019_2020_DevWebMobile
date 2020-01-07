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
    if(eat) {
        movablePawnPlayer = anotherMoveWithEat(joueur, eat.i, eat.j);
        console.log(movablePawnPlayer);
        if(movablePawnPlayer.length == 0) {
            console.log("un");
            endTurn();
        }
        console.log("deux");
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
    let eatMove = (move.i == i+2 || move.i == i-2)? true : false; // On regarde si c'est un mouvement qui mange un pion

    //Sur le plateau !
    let pawnID = plateau[i][j]; // On prend le pion de sa position
    plateau[i][j]=0; // On met la position à 0
    plateau[move.i][move.j]=pawnID; // On place le pion à sa nouvelle position

    //sur la grille svg
    let pawnSVG = document.getElementById("lig" + i + " col" + j); // On prend le pion svg du plateau
    gameGrid.removeChild(pawnSVG); // On le supprime
    var newPawnSVG = pionage(move.i, move.j); // On crée un nouveau pion
    gameGrid.appendChild(newPawnSVG); // On l'ajoute sur le plateau

    //Si c'est un mouvement qui mange un pion alors
    if(eatMove) {
        let eatI = (move.i-i>1)?i+1:i+-1;
        let eatJ = (move.j-j>1)?j+1:j+-1;
        
        //On le supprime du plateau
        plateau[eatI][eatJ]=0;
        //On supprime son svg
        let eatPawnSVG = document.getElementById("lig" + eatI + " col" + eatJ); // On prend le pion svg du plateau
        gameGrid.removeChild(eatPawnSVG);
        return {i : move.i, j : move.j};
    }
    return false;
}