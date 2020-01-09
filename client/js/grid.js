/* tableau représentant l'état du jeu
    0: case vide    
    1: pion blanc
    2: pion noir 
    3: reine blanche
    4: reine noire
*/
const PLATEAU = [
    [-1, 2, -1, 2, -1, 2, -1, 2, -1, 2],
    [2, -1, 2, -1, 2, -1, 2, -1, 2, -1],
    [-1, 2, -1, 2, -1, 2, -1, 2, -1, 2],
    [2, -1, 2, -1, 2, -1, 2, -1, 2, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 1, -1, 1, -1, 1, -1, 1, -1, 1],
    [1, -1, 1, -1, 1, -1, 1, -1, 1, -1],
    [-1, 1, -1, 1, -1, 1, -1, 1, -1, 1],
    [1, -1, 1, -1, 1, -1, 1, -1, 1, -1],
];
var gameGrid; //grid svg du jeu
var plateau = []; //Plateau du jeu
/**
 * Fonction de création de svg.
 * Elle prend en entrée le type de svg (svg, cricle, rect ...)
 * @param {string=} tagName
 */
document.createSvg = function (tagName) {
    var svgNS = "http://www.w3.org/2000/svg";
    return this.createElementNS(svgNS, tagName);
};

/**
 * Fonction de création de pion
 * Translate facultatif
 * @param {int} i : position i du pion 
 * @param {int} j : position j du pion
 */
var pionage = function (i, j) {
    //Attributs du pion
    var color;
    var dame;
    var pos = plateau[i][j];

    dame = (pos == 3 || pos == 4) ? true : false;
    if(pos == 1 || pos == 3) color = "white"
    else if (pos == 2 || pos == 4) color = "black";

    var pion = document.createSvg("circle");
    pion.setAttribute("cx", 25);
    pion.setAttribute("cy", 25);
    pion.setAttribute("r", 20);
    pion.setAttribute("fill", color);
    pion.setAttribute("id", "lig" + i + " col" + j);
    pion.setAttribute("transform", "translate(" + j*50 + "," + i*50 + ")");

    let stroke = (color == "black") ? "red" : "black";
    pion.setAttribute("stroke", stroke)

    if(dame) pion.setAttribute("stroke-width", 7);
    else pion.setAttribute("stroke-width", 2);

    return pion;
};

/**
 * Fonction de création de la grille.
 * Le paramètre size représente la taille d'une case en px
 * @param {integer=} size 
 */
var grid = function (size) {
    var svgGrid = document.createSvg("svg");
    svgGrid.setAttribute("id", "grille");
    svgGrid.setAttribute("viewBox", [0, 0, 10 * size, 10 * size].join(" "));
    svgGrid.setAttribute("preserveAspectRatio", "xMidYMid meet");    

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            //Couleur plus forme de la case
            var color = ((i + j) % 2) ? "brown" : "yellow";
            var square = document.createSvg("rect");
            //Tous les attributs de la case 
            square.setAttribute("width", size);
            square.setAttribute("height", size);
            square.setAttribute("fill", color);
            square.setAttribute("id", "Lig" + i + " Col" + j);
            var translate = ["translate(", j * size, ",", i * size, ")"].join("");
            square.setAttribute("transform", translate);
            //ajout dans la grille
            svgGrid.appendChild(square);

            //Evenement sur les cases cliquable
            // if (plateau[i][j] >= 0) square.setAttribute("onclick", "caseSelct(this.id)");

            //Pion noir
            if(plateau[i][j]==1 || plateau[i][j]==2 || plateau[i][j]==3) {
                let pion = pionage(i, j);           
                svgGrid.appendChild(pion);
            }
        }
    }
    return svgGrid;
};

function initGame(board) {
    /*initialisation du plateau*/
    if (board) plateau = board
    else {
        for (let index = 0; index < PLATEAU.length; index++) {
            plateau[index] = PLATEAU[index].slice(); 
        }
    }
    var container = document.getElementById("container");
    if (gameGrid != undefined) container.removeChild(gameGrid);
    gameGrid = grid(50);
    container.appendChild(gameGrid);
}
