
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
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0]
];

var noeud = document.getElementById("grille");
var filsNoeud = noeud.childNodes;

/**
 * Cette fonction est appelé dans tous les cas une fois que la fonction caseSelect terminé
 * Elle permet de gérer la régle de prise obligatoire de la pièce adverse.
 * @param {string=} joueur 
 */
var pionABouger = function(joueur){
    // un tableau pour stocker les pions qu'on a droit de bouger(cas prise obligatoire) 
    var tabPionABouger=[];
    var count =0;
    //joueur pions noir
    if(joueur=="joueur1"){
      //parcourir le tableau plateau pour voir s'il y a des cas de prise obligatoire
      for (var i = 0; i < 10; i++) {
         for (var j = 0; j < 10; j++) {
             //si on trouve un ou plusieur cas de prise obligatoire
            if((plateau[i][j]==1 && plateau[i+1][j+1]==2 && plateau[i+2][j+2]==0)|| (plateau[i][j]==1 && plateau[i+1][j-1]==2 && plateau[i+2][j-2]==0)){
                var id = "lig"+i+" col"+j;
                var lig = i;
                var col = j; 
                //stocker les id des pions(min = 1 pion , max = 2 pion) qu'il faut bouger(prise obligatoire)
                tabPionABouger[count]=id;
                count++;
               
                //si un seul cas de prise obligatoire (c.a.d tabPionABouger.length==1)
                if(tabPionABouger.length==1){
                    /*parcourir tous les noeud fils de l'élément svgGrid pour:
                    -supprimer l'évenemnt onclick sur tous les pions sauf celui/ceux qu'il faut bouger (prise obligatoire)
                    -supprimer l'évenemnt onclick sur toutes les cases sauf celle/celles vers lesquelles les pions seront déplacer(prise obligatoire)*/
                    for(var h=0; h<filsNoeud.length;h++){
                    if(filsNoeud[h].getAttribute("onclick")=="selectPion(this.id)" &&  filsNoeud[h].getAttribute("fill") == "black" && filsNoeud[h].getAttribute("id")!=tabPionABouger[0]){
                        filsNoeud[h].removeAttribute("onclick");
                        console.log("joueur1 if");
                    }
                    if(filsNoeud[h].getAttribute("onclick")=="caseSelct(this.id)" && ((filsNoeud[h].getAttribute("id")!="Lig"+(i+2)+" Col"+(j+2) && plateau[i+1][j+1]==2) ||
                    (filsNoeud[h].getAttribute("id")!="Lig"+(i+2)+" Col"+(j-2) && plateau[i+1][j-1]==2))){
                        filsNoeud[h].removeAttribute("onclick");
                    }
                    }
                //si deux cas de prise obligatoire (c.a.d tabPionABouger.length==2)    
                }else if(tabPionABouger.length==2){
                    for(var h=0; h<filsNoeud.length;h++){
                    if(filsNoeud[h].getAttribute("onclick")=="selectPion(this.id)" &&  filsNoeud[h].getAttribute("fill") == "black"){
                    filsNoeud[h].removeAttribute("onclick");
                    }
                    if(filsNoeud[h].getAttribute("onclick")=="caseSelct(this.id)"){
                        filsNoeud[h].removeAttribute("onclick");
                    }
                    
                    }
                    
                    document.getElementById(tabPionABouger[0]).setAttribute("onclick","selectPion(this.id)");
                    document.getElementById(tabPionABouger[1]).setAttribute("onclick","selectPion(this.id)");
                    document.getElementById("Lig"+(parseInt(tabPionABouger[0].substring(3,4))+2)+" Col"+parseInt(tabPionABouger[0].substring(8))).setAttribute("onclick","caseSelct(this.id)");
                    document.getElementById("Lig"+(parseInt(tabPionABouger[1].substring(3,4))+2)+" Col"+parseInt(tabPionABouger[1].substring(8))).setAttribute("onclick","caseSelct(this.id)");
                } 
            }

         }  
      }
     
    }

   if(joueur=="joueur2"){
      for (var i = 0; i < 10; i++) {
         for (var j = 0; j < 10; j++) {
            if((plateau[i][j]==2 && plateau[i-1][j+1]==1 && plateau[i-2][j+2]==0)|| (plateau[i][j]==2 && plateau[i-1][j-1]==1 && plateau[i-2][j-2]==0)){
                var id = "lig"+i+" col"+j;
                var lig = i;
                var col = j; 
                tabPionABouger[count]=id;  
                count++;
               
            
                
                if(tabPionABouger.length==1){
                    for(var h=0; h<filsNoeud.length;h++){
                    if(filsNoeud[h].getAttribute("onclick")=="selectPion(this.id)" &&  filsNoeud[h].getAttribute("fill") == "white" && filsNoeud[h].getAttribute("id")!=tabPionABouger[0]){
                        filsNoeud[h].removeAttribute("onclick");
                        console.log("joueur1 if");
                    }
                    if(filsNoeud[h].getAttribute("onclick")=="caseSelct(this.id)" && ((filsNoeud[h].getAttribute("id")!="Lig"+(i-2)+" Col"+(j+2) && plateau[i-1][j+1]==1) ||
                    (filsNoeud[h].getAttribute("id")!="Lig"+(i-2)+" Col"+(j-2) && plateau[i-1][j-1]==1))){
                        filsNoeud[h].removeAttribute("onclick");
                    }
                    }
                }else{
                    for(var h=0; h<filsNoeud.length;h++){
                        if(filsNoeud[h].getAttribute("onclick")=="selectPion(this.id)" &&  filsNoeud[h].getAttribute("fill") == "white"){
                        filsNoeud[h].removeAttribute("onclick");
                        }
                        if(filsNoeud[h].getAttribute("onclick")=="caseSelct(this.id)"){
                        filsNoeud[h].removeAttribute("onclick");
                    }
                    } 
                    document.getElementById(tabPionABouger[0]).setAttribute("onclick","selectPion(this.id)");
                    document.getElementById(tabPionABouger[1]).setAttribute("onclick","selectPion(this.id)");
                    
                    document.getElementById("Lig"+(parseInt(tabPionABouger[0].substring(3,4))-2)+" Col"+parseInt(tabPionABouger[0].substring(8))).setAttribute("onclick","caseSelct(this.id)");
                    document.getElementById("Lig"+(parseInt(tabPionABouger[1].substring(3,4))-2)+" Col"+parseInt(tabPionABouger[1].substring(8))).setAttribute("onclick","caseSelct(this.id)");
                } 
            }
        
         }
      }
     
    }
     
  }


/**
 * Fonction appelée après avoir pris un pion afin de réinitialiser les fonctions selectPion et case Select
 * --Cette fonction remet l'evenemnt "onclick" sur tous les pions et toutes les case après les avoir suprrimer dans la fonction PionABouger(prise obligatoire)
 * @param {string=} couleurPion 
 */
var miseAjour = function(couleurPion){
    var noeud = document.getElementById("grille");
    var filsNoeud = noeud.childNodes;
   
      if(couleurPion=="black"){
          /*parcourir tous les fils du noeud svgGrid pour ajouter les evenemnts "onclick" aux pions et cases*/
        for(var g =0;g<filsNoeud.length;g++){
            if(filsNoeud[g].getAttribute("fill")=="black"){
            filsNoeud[g].setAttribute("onclick", "selectPion(this.id)");
            
            }
        
            if(filsNoeud[g].getAttribute("fill")=="brown"){
                filsNoeud[g].setAttribute("onclick", "caseSelct(this.id)");
                
            }
        
        }
      }
      else if (couleurPion=="white"){
          /*parcourir tous les fils du noeud svgGrid pour ajouter les evenemnts "onclick" aux pions et cases*/
            for(var g =0;g<filsNoeud.length;g++){
            if(filsNoeud[g].getAttribute("fill")=="white"){
            filsNoeud[g].setAttribute("onclick", "selectPion(this.id)");
            
            }
            
        
            if(filsNoeud[g].getAttribute("fill")=="brown"){
                filsNoeud[g].setAttribute("onclick", "caseSelct(this.id)");
                
            }
        
        }
      }

  }

//tableau pour gérer les tour de jeu, 
var joueurs = ["joueur1"];

//garder une trace du pion qui a été séléctionner 
var elemClignote;

/*varaible pour stocker le pion qui a été bouger avec les nouvelles cordonnées : 
cette variable nous permet de voir si le joueur qui vient de jouer peut rejouer 
encore( rafle par un pion) ou pas*/ 
var pionbouger;

/**
 * cette fonction gére les tour de jeux 
 * gérer
 * @param {string=} couleurPion 
 */
var gereTourJeu = function (couleurPion) {
    //récupérer les cordonnée du pion qui a été bouger (c'est a dire la nouvelle position du pion)
    var cordPion = pionbouger.getAttribute("transform");
    var id = pionbouger.getAttribute("id");
    var xPionBoug = parseInt(cordPion.substring(10, cordPion.indexOf(',')));
    var yPionBoug = parseInt(cordPion.substring(cordPion.indexOf(',') + 1, cordPion.length - 1));

    //joueur 1
    if (couleurPion == "black") {

        if (yPionBoug >= 400 || xPionBoug >= 400)
            return "joueur2";
        //si posibilité de rafle, le joueur 1 garde la main
        else if ((plateau[(yPionBoug + 100) / 50][(xPionBoug - 100) / 50] == 0 || plateau[(yPionBoug + 100) / 50][(xPionBoug + 100) / 50] == 0) &&
            (plateau[(yPionBoug + 50) / 50][(xPionBoug + 50) / 50] == 2 || plateau[(yPionBoug + 50) / 50][(xPionBoug - 50) / 50] == 2)) {
            selectPion(id);
            return "joueur1";
        } else
        //sinon passer la main au joueur 2
            return "joueur2";
    }
    //joueur 2
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
    var ligne = parseInt(idCell.substring(3,4));
    var col = parseInt(idCell.substring(8,9));

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
    console.log("etat de la case : ",etatCase);
    
    
    /*-------------les cas de déplacement des pions --------------*/

    /*-------------déplacement sans gagner de piont --------------*/
   
    //récupérer l'élemnt svgGrid
    var svg = document.getElementById("grille");

    //nouveau "id" du pion à sa nouvelle position
    var id = "lig" + (yCell / 50) + " col" + (xCell / 50);

    //vérifier si y'a un pion sélictionné
    if (elemClignote && etatCase == 0) {
        //vérifier si la case est libre
        var fill = elemClignote.getAttribute("fill");
        if (fill == "black" && yCell == yPion + 50 && joueurs[0] == "joueur1" && (xCell == xPion - 50 || xCell == xPion + 50)) {
            var pion = pionage(fill, xCell, yCell);
            pion.setAttribute("id", id);
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
            pion.setAttribute("id", id);
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
                //mettre un pion sur la case selectionnée
                var pion = pionage(fill, xCell, yCell);
                //ajouter le nouveau id au pion ajouté sur la case selectionnée
                pion.setAttribute("id", id);
                pionbouger = pion;
                console.log(pionbouger);
                //ajouter le pion au svgGrid
                svg.appendChild(pion);
                //supprimer le pion de son ancienne position 
                svg.removeChild(elemClignote); 
                //identifier le pion qui a été déplacé pour le supprimer de son ancienne position
                var idPionAdv = "lig" + (yCell - 50) / 50 + " col" + (xCell + 50) / 50;
                var elementAdver = document.getElementById(idPionAdv);
                svg.removeChild(elementAdver);
                //après suppression du pion on met sa valeur dans le tableau plateau à 0
                plateau[(yCell - 50) / 50][(xCell + 50) / 50] = 0;
            }
            else if (xCell == xPion + 100 && plateau[(yCell - 50) / 50][(xCell - 50) / 50] == 2) {
                var pion = pionage(fill, xCell, yCell);
                pion.setAttribute("id", id);
                pionbouger = pion;
                console.log(pionbouger);
                svg.appendChild(pion);
                svg.removeChild(elemClignote);
                var idPionAdv = "lig" + (yCell - 50) / 50 + " col" + (xCell - 50) / 50;
                var elementAdver = document.getElementById(idPionAdv);
                svg.removeChild(elementAdver);
                plateau[(yCell - 50) / 50][(xCell - 50) / 50] = 0;
            }
             //mettre à jour le plateau
             plateau[ligne][col] = 1;
             plateau[yPion / 50][xPion / 50] = 0;

            joueurs[0] = gereTourJeu("black");
            pionABouger(joueurs[0]);
            miseAjour("black");
        }
        /* joueur blanc*/
        else if (fill == "white" && yCell == yPion - 100 && joueurs[0] == "joueur2" && (xCell == xPion - 100 || xCell == xPion + 100)) {

            if (xCell == xPion - 100 && plateau[(yCell + 50) / 50][(xCell + 50) / 50] == 1) {
                var pion = pionage(fill, xCell, yCell);
                pion.setAttribute("id", id);
                pionbouger = pion;
                console.log(pionbouger);
                svg.appendChild(pion);
                svg.removeChild(elemClignote);
                var idPionAdv = "lig" + (yCell + 50) / 50 + " col" + (xCell + 50) / 50;
                var elementAdver = document.getElementById(idPionAdv);
                svg.removeChild(elementAdver);
                plateau[(yCell + 50) / 50][(xCell + 50) / 50] = 0;

            }
            else if (xCell == xPion + 100 && plateau[(yCell + 50) / 50][(xCell - 50) / 50] == 1) {
                var pion = pionage(fill, xCell, yCell);
                pion.setAttribute("id", id);
                pionbouger = pion;
                console.log(pionbouger);
                svg.appendChild(pion);
                svg.removeChild(elemClignote);
                var idPionAdv = "lig" + (yCell + 50) / 50 + " col" + (xCell - 50) / 50;
                var elementAdver = document.getElementById(idPionAdv);
                svg.removeChild(elementAdver);
                plateau[(yCell + 50) / 50][(xCell - 50) / 50] = 0;
            }
             //mettre à jour le plateau
             plateau[ligne][col] = 2;
             plateau[yPion / 50][xPion / 50] = 0;

            joueurs[0] = gereTourJeu("white");
            pionABouger(joueurs[0]);
            miseAjour("white");
            console.log(joueurs[0]);
        }
    }
   
}


var moveEffectuer = function(x,y, xd, yd){ 
    selectPion("lig"+x+" col"+y);
    caseSelct("Lig"+xd+" Col"+yd);
    
}

var suppEvenementClick = function(){
    var svgGrid = document.getElementById("grille");
    var filsNoeud = svgGrid.childNodes;
    for(var h=0; h<filsNoeud.length;h++){
        if(filsNoeud[h].getAttribute("onclick")== "selectPion(this.id)"){
            filsNoeud[h].removeAttribute("onclick");
        }
    }

}

var AjoutEvenementClick = function(){
    var svgGrid = document.getElementById("grille");
    var filsNoeud = svgGrid.childNodes;
    for(var h=0; h<filsNoeud.length;h++){
        if(filsNoeud[h].nodeName ="circle"){
            filsNoeud[h].setAttribute("onclick", "selectPion(this.id)");
        }
    }

}
