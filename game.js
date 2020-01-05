
/* tableau représentant l'état du jeu
    0: case vide    
    1: pion noir 
    2: pion blanc
    3: reine noire
    4: reine blanche
*/
var plateau = [
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2]
];
var noeud = document.getElementById("grille");
var filsNoeud = noeud.childNodes;

/**
 * Cette fonction est appelé dans tous les cas une fois que la fonction caseSelect terminé
 * Elle permet de 
 * @param {string=} joueur 
 */
var pionABouger = function (joueur) {

    var tab = [];
    var count = 0;
    if (joueur == "joueur1") {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                if ((plateau[i][j] == 1 && plateau[i + 1][j + 1] == 2 && plateau[i + 2][j + 2] == 0) || (plateau[i][j] == 1 && plateau[i + 1][j - 1] == 2 && plateau[i + 2][j - 2] == 0)) {
                    var id = "lig" + i + " col" + j;
                    var lig = i;
                    var col = j;
                    tab[count] = id;
                    count++;
                    console.log("noir", tab.length);
                    console.log("id: ", id);
                    for (var h = 0; h < filsNoeud.length; h++) {
                        if (tab.length == 1) {
                            if ((filsNoeud[h].getAttribute("onclick") == "selectPion(this.id)" && filsNoeud[h].getAttribute("fill") == "black" && filsNoeud[h].getAttribute("id") != id) ||
                                (filsNoeud[h].getAttribute("onclick") == "caseSelct(this.id)" && filsNoeud[h].getAttribute("id") != "Lig" + (i + 2) + " Col" + (j + 2) && filsNoeud[h].getAttribute("id") != "Lig" + (i + 2) + " Col" + (j - 2))) {
                                filsNoeud[h].removeAttribute("onclick");
                                console.log("joueur1 if");
                            }
                        } else {

                            var ligCel_1 = parseInt(tab[0].substring(3, tab[0].indexOf(" ")));
                            var colCel_1 = parseInt(tab[0].substring(8));
                            var idCell_1 = "Lig" + (ligCel_1 + 2) + " Col" + (colCel_1);

                            var ligCel_2 = parseInt(tab[1].substring(3, tab[1].indexOf(" ")));
                            var colCel_2 = parseInt(tab[1].substring(8));
                            var idCell_2 = "Lig" + (ligCel_2 + 2) + " Col" + (colCel_2);

                            if ((filsNoeud[h].getAttribute("onclick") == "selectPion(this.id)" && filsNoeud[h].getAttribute("fill") == "black") || (filsNoeud[h].getAttribute("onclick") == "caseSelct(this.id)")) {
                                filsNoeud[h].removeAttribute("onclick");
                            }
                            document.getElementById(tab[0]).setAttribute("onclick", "selectPion(this.id)");
                            document.getElementById(tab[1]).setAttribute("onclick", "selectPion(this.id)");
                            document.getElementById(idCell_1).setAttribute("onclick", "caseSelct(this.id)");
                            document.getElementById(idCell_2).setAttribute("onclick", "caseSelct(this.id)");
                        }
                    }
                }
            }
        }
    }

    if (joueur == "joueur2") {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                if ((plateau[i][j] == 2 && plateau[i - 1][j + 1] == 1 && plateau[i - 2][j + 2] == 0) || (plateau[i][j] == 2 && plateau[i - 1][j - 1] == 1 && plateau[i - 2][j - 2] == 0)) {
                    var id = "lig" + i + " col" + j;
                    var lig = i;
                    var col = j;
                    tab[count] = id;
                    console.log("blanc", tab.length);
                    count++;
                    console.log("id", id);

                    for (var h = 0; h < filsNoeud.length; h++) {
                        if (tab.length == 1) {
                            if ((filsNoeud[h].getAttribute("onclick") == "selectPion(this.id)" && filsNoeud[h].getAttribute("fill") == "white" && filsNoeud[h].getAttribute("id") != id) ||
                                (filsNoeud[h].getAttribute("onclick") == "caseSelct(this.id)" && filsNoeud[h].getAttribute("id") != "Lig" + (i - 2) + " Col" + (j + 2) && filsNoeud[h].getAttribute("id") != "Lig" + (i - 2) + " Col" + (j - 2))) {
                                filsNoeud[h].removeAttribute("onclick");
                                console.log("joueur1 if");
                            }
                        } else {
                            var ligCel_1 = parseInt(tab[0].substring(3, tab[0].indexOf(" ")));
                            var colCel_1 = parseInt(tab[0].substring(8));
                            var idCell_1 = "Lig" + (ligCel_1 - 2) + " Col" + (colCel_1);

                            var ligCel_2 = parseInt(tab[1].substring(3, tab[1].indexOf(" ")));
                            var colCel_2 = parseInt(tab[1].substring(8));
                            var idCell_2 = "Lig" + (ligCel_2 - 2) + " Col" + (colCel_2);

                            if ((filsNoeud[h].getAttribute("onclick") == "selectPion(this.id)" && filsNoeud[h].getAttribute("fill") == "white") || (filsNoeud[h].getAttribute("onclick") == "caseSelct(this.id)")) {
                                filsNoeud[h].removeAttribute("onclick");
                            }
                            document.getElementById(tab[0]).setAttribute("onclick", "selectPion(this.id)");
                            document.getElementById(tab[1]).setAttribute("onclick", "selectPion(this.id)");
                            document.getElementById(idCell_1).setAttribute("onclick", "caseSelct(this.id)");
                            document.getElementById(idCell_2).setAttribute("onclick", "caseSelct(this.id)");

                        }
                    }
                }
            }
        }
    }
}

/**
 * Fonction appelée après avoir pris un pion afin de réinitialiser les fonctions selectPion et case Select
 * @param {string=} couleurPion 
 */
var miseAjour = function (couleurPion) {
    var noeud = document.getElementById("grille");
    var filsNoeud = noeud.childNodes;
    var count = 0;
    for (var k = 0; k < filsNoeud.length; k++) {
        if (filsNoeud[k].getAttribute("fill") == "brown" && filsNoeud[k].getAttribute("onclick")) {
            count++;
        }
    }
    console.log("count", count);
    if (couleurPion == "black") {
        for (var g = 0; g < filsNoeud.length; g++) {
            if (filsNoeud[g].getAttribute("fill") == "black") {
                filsNoeud[g].setAttribute("onclick", "selectPion(this.id)");
            }
            else if (count <= 2) {
                if (filsNoeud[g].getAttribute("fill") == "brown") {
                    filsNoeud[g].setAttribute("onclick", "caseSelct(this.id)");
                }
            }
        }
    }
    else if (couleurPion == "white") {
        for (var g = 0; g < filsNoeud.length; g++) {
            if (filsNoeud[g].getAttribute("fill") == "white") {
                filsNoeud[g].setAttribute("onclick", "selectPion(this.id)");
            }
            else if (count <= 2) {
                if (filsNoeud[g].getAttribute("fill") == "brown") {
                    filsNoeud[g].setAttribute("onclick", "caseSelct(this.id)");
                }
            }
        }
    }
}

//tableau pour gérer les tour de jeu 
var joueurs = ["joueur1"];

//pion séléctionné
var elemClignote;

//varaible pour stocker le pion qui a été bouger 
var pionbouger;

/**
 * gérer
 * @param {string=} couleurPion 
 */
var gereTourJeu = function (couleurPion) {

    var cordPion = pionbouger.getAttribute("transform");
    var id = pionbouger.getAttribute("id");
    var xPionBoug = parseInt(cordPion.substring(10, cordPion.indexOf(',')));
    var yPionBoug = parseInt(cordPion.substring(cordPion.indexOf(',') + 1, cordPion.length - 1));

    if (couleurPion == "black") {

        if (yPionBoug >= 400 || xPionBoug >= 400)
            return "joueur2";

        else if ((plateau[(yPionBoug + 100) / 50][(xPionBoug - 100) / 50] == 0 || plateau[(yPionBoug + 100) / 50][(xPionBoug + 100) / 50] == 0) &&
            (plateau[(yPionBoug + 50) / 50][(xPionBoug + 50) / 50] == 2 || plateau[(yPionBoug + 50) / 50][(xPionBoug - 50) / 50] == 2)) {
            selectPion(id);
            return "joueur1";
        } else
            return "joueur2";
    }

    else {

        if (yPionBoug <= 50 || xPionBoug <= 50)

            return "joueur1";

        else if ((plateau[(yPionBoug - 100) / 50][(xPionBoug - 100) / 50] == 0 || plateau[(yPionBoug - 100) / 50][(xPionBoug + 100) / 50] == 0) &&
            (plateau[(yPionBoug - 50) / 50][(xPionBoug + 50) / 50] == 1 || plateau[(yPionBoug - 50) / 50][(xPionBoug - 50) / 50] == 1)) {
            selectPion(id);
            return "joueur2";
        } else
            return "joueur1";
    }
}
