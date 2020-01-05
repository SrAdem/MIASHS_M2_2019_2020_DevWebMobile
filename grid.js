
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
 * @param {string=} color 
 * @param {integer=} xPion 
 * @param {integer=} yPion 
 * @param {string=} translate 
 */
var pionage = function (color, xPion, yPion, translate) {
    var pion = document.createSvg("circle");

    pion.setAttribute("cx", 25);
    pion.setAttribute("cy", 25);
    pion.setAttribute("r", 20);
    pion.setAttribute("fill", color);

    let stroke;
    if (color == "black") {
        stroke = "red";
    } else {
        stroke = "black";
    }

    pion.setAttribute("stroke", stroke)
    pion.setAttribute("stroke-width", 2);
    pion.setAttribute("onclick", "selectPion(this.id)");

    if (translate) {
        pion.setAttribute("transform", translate);
    } else {
        pion.setAttribute("transform", "translate(" + xPion + "," + yPion + ")");
    }
    pionbouger = pion;
    return pion;
};

/**
 * Fonction de création de la grille.
 * Le paramètre size représente la taille d'une case en px
 * @param {integer=} size 
 * @param {string[2]=} colors 
 */
var grid = function (size, colors) {
    var svgGrid = document.createSvg("svg");
    svgGrid.setAttribute("id", "grille");
    svgGrid.setAttribute("viewBox", [0, 0, 10 * size, 10 * size].join(" "));
    svgGrid.setAttribute("preserveAspectRatio", "xMidYMid meet");
    let numPionJoueurB = 1;
    let numPionJoueurA = 20;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var color = colors[(i + j) % 2];
            var box = document.createSvg("rect");

            box.setAttribute("width", size);
            box.setAttribute("height", size);
            box.setAttribute("fill", color);

            if (color == "brown") box.setAttribute("onclick", "caseSelct(this.id)");
            box.setAttribute("id", "Lig" + i + " Col" + j);
            var translate = ["translate(", j * size, ",", i * size, ")"].join("");
            box.setAttribute("transform", translate);
            svgGrid.appendChild(box);

            //pions joueur A
            if (color == "brown" && i < 4) {
                let pion = pionage("black", i, j, translate);
                pion.setAttribute("id", "lig" + i + " col" + j);
                numPionJoueurA--;
                svgGrid.appendChild(pion);
            };

            //pions joueur B
            if (color == "brown" && (i <= 9 && i >= 6)) {
                let pion = pionage("white", i, j, translate);
                pion.setAttribute("id", "lig" + i + " col" + j);
                numPionJoueurB++;
                svgGrid.appendChild(pion);
            };
        }
    }
    return svgGrid;
};

/*initialisation du plateau*/
var container = document.getElementById("container");
container.appendChild(grid(50, ["yellow", "brown"]));

/**
* Fonction activable sur chaque pion de la couleur du joueur actif
* Modifie l'elemClignote par celui cliqué
* @param {string=} idPion 
*/
var selectPion = function (idPion) {

    var elemClick = document.getElementById(idPion);
    var couleurPion = elemClick.getAttribute("fill");

    if ((couleurPion == "black" && joueurs[0] == "joueur1") ||
        (couleurPion == "white" && joueurs[0] == "joueur2")) {
        if (elemClignote != undefined) elemClignote.removeAttribute("class");
        elemClick.setAttribute("class", "pionActif");
        elemClignote = elemClick;
    }

    /* WorkInProgress */
    if (couleurPion == "black" && joueurs[0] == "joueur1") {
        var cordPionActif = elemClignote.getAttribute("transform");
        var xPion = parseInt(cordPionActif.substring(10, cordPionActif.indexOf(',')));
        var yPion = parseInt(cordPionActif.substring(cordPionActif.indexOf(',') + 1, cordPionActif.length - 1));
        console.log(xPion, yPion);
    }
}

/**
 * Fonction activable sur chaque case de la grille
 * En fonction de l'agencement du jeu, le pion séléctionné elemClignote est déplacé ou non sur la case cliquée
 * @param {string=} idCell 
 */
var caseSelct = function (idCell) {
    //case séléction (ligne, colonne)
    var ligne = parseInt(idCell.substring(3, idCell.indexOf(" ")));
    var col = parseInt(idCell.substring(idCell.indexOf("l") + 1, idCell.length));

    //cordonnées de la case
    var cell = document.getElementById(idCell);
    var cordCell = cell.getAttribute("transform");
    var xCell = parseInt(cordCell.substring(10, cordCell.indexOf(',')));
    var yCell = parseInt(cordCell.substring(cordCell.indexOf(',') + 1, cordCell.length - 1));

    //cordonnées du pion actif
    var cordPionActif = elemClignote.getAttribute("transform");
    var xPion = parseInt(cordPionActif.substring(10, cordPionActif.indexOf(',')));
    var yPion = parseInt(cordPionActif.substring(cordPionActif.indexOf(',') + 1, cordPionActif.length - 1));

    //vérifier si y'a un pion sur la case
    var etatCase = plateau[ligne][col];

    /*-------------les cas de déplacement des pions --------------*/

    /*-------------déplacement sans gagner de piont --------------*/
    //vérifier si y'a un pion sélictionné
    if (elemClignote && etatCase == 0) {
        //vérifier si la case est libre
        var fill = elemClignote.getAttribute("fill");
        if (fill == "black" && yCell == yPion + 50 && joueurs[0] == "joueur1" && (xCell == xPion - 50 || xCell == xPion + 50)) {
            var pion = pionage(fill, xCell, yCell);

            var id = "lig" + (yCell / 50) + " col" + (xCell / 50);
            pion.setAttribute("id", id);
            var svg = document.getElementById("grille");
            svg.appendChild(pion);
            svg.removeChild(elemClignote);
            //mettre à jour le plateau
            plateau[ligne][col] = 1;
            plateau[yPion / 50][xPion / 50] = 0;
            joueurs[0] = "joueur2";
            pionABouger(joueurs[0]);
        }

        else if (fill == "white" && yCell == yPion - 50 && joueurs[0] == "joueur2" && (xCell == xPion - 50 || xCell == xPion + 50)) {
            var pion = pionage(fill, xCell, yCell);

            var id = "lig" + (yCell / 50) + " col" + (xCell / 50);
            pion.setAttribute("id", id);
            var svg = document.getElementById("grille");
            svg.appendChild(pion);
            svg.removeChild(elemClignote);
            //mettre à jour le plateau
            plateau[ligne][col] = 2;
            plateau[yPion / 50][xPion / 50] = 0;
            joueurs[0] = "joueur1";
            pionABouger(joueurs[0]);

        }

        /*-------------déplacement avec point gagné  --------------*/
        /* joueur noir*/
        else if (fill == "black" && yCell == yPion + 100 && joueurs[0] == "joueur1" && (xCell == xPion - 100 || xCell == xPion + 100)) {

            if (xCell == xPion - 100 && plateau[(yCell - 50) / 50][(xCell + 50) / 50] == 2) {
                var pion = pionage(fill, xCell, yCell);

                var id = "lig" + (yCell / 50) + " col" + (xCell / 50);
                pion.setAttribute("id", id);
                pionbouger = pion;
                console.log(pionbouger);
                var svg = document.getElementById("grille");
                svg.appendChild(pion);
                svg.removeChild(elemClignote);
                //mettre à jour le plateau
                plateau[ligne][col] = 1;
                plateau[yPion / 50][xPion / 50] = 0;
                var id = "lig" + (yCell - 50) / 50 + " col" + (xCell + 50) / 50;
                var elementAdver = document.getElementById(id);
                svg.removeChild(elementAdver);
                plateau[(yCell - 50) / 50][(xCell + 50) / 50] = 0;
            }
            else if (xCell == xPion + 100 && plateau[(yCell - 50) / 50][(xCell - 50) / 50] == 2) {
                var pion = pionage(fill, xCell, yCell);

                var idPion = "lig" + (yCell / 50) + " col" + (xCell / 50);
                pion.setAttribute("id", idPion);
                pionbouger = pion;
                console.log(pionbouger);
                var svg = document.getElementById("grille");
                svg.appendChild(pion);
                svg.removeChild(elemClignote);
                //mettre à jour le plateau
                plateau[ligne][col] = 1;
                plateau[yPion / 50][xPion / 50] = 0;
                var idPionAdv = "lig" + (yCell - 50) / 50 + " col" + (xCell - 50) / 50;
                var elementAdver = document.getElementById(idPionAdv);
                svg.removeChild(elementAdver);
                plateau[(yCell - 50) / 50][(xCell - 50) / 50] = 0;
            }
            joueurs[0] = gereTourJeu("black");
            pionABouger(joueurs[0]);
            miseAjour("black");
        }
        /* joueur blanc*/
        else if (fill == "white" && yCell == yPion - 100 && joueurs[0] == "joueur2" && (xCell == xPion - 100 || xCell == xPion + 100)) {

            if (xCell == xPion - 100 && plateau[(yCell + 50) / 50][(xCell + 50) / 50] == 1) {
                var pion = pionage(fill, xCell, yCell);

                var id = "lig" + (yCell / 50) + " col" + (xCell / 50);
                pion.setAttribute("id", id);
                pionbouger = pion;
                console.log(pionbouger);
                var svg = document.getElementById("grille");
                svg.appendChild(pion);
                svg.removeChild(elemClignote);
                //mettre à jour le plateau
                plateau[ligne][col] = 2;
                plateau[yPion / 50][xPion / 50] = 0;
                var id = "lig" + (yCell + 50) / 50 + " col" + (xCell + 50) / 50;
                var elementAdver = document.getElementById(id);
                svg.removeChild(elementAdver);
                plateau[(yCell + 50) / 50][(xCell + 50) / 50] = 0;

            }
            else if (xCell == xPion + 100 && plateau[(yCell + 50) / 50][(xCell - 50) / 50] == 1) {
                var pion = pionage(fill, xCell, yCell);

                var idPion = "lig" + (yCell / 50) + " col" + (xCell / 50);
                pion.setAttribute("id", idPion);
                pionbouger = pion;
                console.log(pionbouger);

                var svg = document.getElementById("grille");
                svg.appendChild(pion);
                svg.removeChild(elemClignote);
                //mettre à jour le plateau
                plateau[ligne][col] = 2;
                plateau[yPion / 50][xPion / 50] = 0;
                var idPionAdv = "lig" + (yCell + 50) / 50 + " col" + (xCell - 50) / 50;
                var elementAdver = document.getElementById(idPionAdv);
                svg.removeChild(elementAdver);
                plateau[(yCell + 50) / 50][(xCell - 50) / 50] = 0;
            }
            joueurs[0] = gereTourJeu("white");
            pionABouger(joueurs[0]);
            miseAjour("white");
            console.log(joueurs[0]);
        }
    }
}