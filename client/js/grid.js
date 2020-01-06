
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
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var color = colors[(i + j) % 2];
            var box = document.createSvg("rect");

            box.setAttribute("width", size);
            box.setAttribute("height", size);
            box.setAttribute("fill", color);

            if (color == "brown") box.setAttribute("onclick", "move(this.id)");
            box.setAttribute("id", "Lig" + i + " Col" + j);
            var translate = ["translate(", j * size, ",", i * size, ")"].join("");
            box.setAttribute("transform", translate);
            svgGrid.appendChild(box);

            //pions joueur A
            if (color == "brown" && i < 4) {
                let pion = pionage("black", i, j, translate);
                pion.setAttribute("id", "lig" + i + " col" + j);                
                svgGrid.appendChild(pion);
            };

            //pions joueur B
            if (color == "brown" && (i <= 9 && i >= 6)) {
                let pion = pionage("white", i, j, translate);
                pion.setAttribute("id", "lig" + i + " col" + j);               
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
