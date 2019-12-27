/*initialisation du plateau*/

document.createSvg = function (tagName) {
    var svgNS = "http://www.w3.org/2000/svg";
    return this.createElementNS(svgNS, tagName);
  };

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
    pion.setAttribute("stroke-width", 3);
    pion.setAttribute("onclick", "selectPion(this.id)");

    if (translate) {
      pion.setAttribute("transform", translate);
    } else {
      pion.setAttribute("transform", "translate(" + xPion + "," + yPion + ")");
    }
    pionbouger = pion;
    return pion;
  };


  var grid = function (numberPerSide, size, pixelsPerSide, colors) {
    var svgGrid = document.createSvg("svg");
    svgGrid.setAttribute("width", 45 + "vw");
    svgGrid.setAttribute("height", 45 + "vw");
    svgGrid.setAttribute("id", "grille");
    svgGrid.setAttribute("viewBox", [0, 0, numberPerSide * size, numberPerSide * size].join(" "));
    svgGrid.setAttribute("preserveAspectRatio", "xMidYMid meet");
    let numPionJoueurB = 1;
    let numPionJoueurA = 20;
    for (var i = 0; i < numberPerSide; i++) {
      for (var j = 0; j < numberPerSide; j++) {
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

  var container = document.getElementById("container");
  container.appendChild(grid(10, 50, 1000, ["brown", "yellow"]));
  
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

  var pionABouger = function(joueur){
    
    var tab=[];
    var count =0;
    if(joueur=="joueur1"){
      for (var i = 0; i < 10; i++) {
         for (var j = 0; j < 10; j++) {
          if((plateau[i][j]==1 && plateau[i+1][j+1]==2 && plateau[i+2][j+2]==0)|| (plateau[i][j]==1 && plateau[i+1][j-1]==2 && plateau[i+2][j-2]==0)){
            var id = "lig"+i+" col"+j;
            var lig = i;
            var col = j; 
            tab[count]=id;
            count++;
            console.log("noir",tab.length);
            console.log("id: ",id);
            for(var h=0; h<filsNoeud.length;h++){
              if(tab.length==1){
              if((filsNoeud[h].getAttribute("onclick")=="selectPion(this.id)" &&  filsNoeud[h].getAttribute("fill") == "black" && filsNoeud[h].getAttribute("id")!=id) || 
              (filsNoeud[h].getAttribute("onclick")=="caseSelct(this.id)" && filsNoeud[h].getAttribute("id")!="Lig"+(i+2)+" Col"+(j+2) && filsNoeud[h].getAttribute("id")!="Lig"+(i+2)+" Col"+(j-2))){
                  filsNoeud[h].removeAttribute("onclick");
                  console.log("joueur1 if");
              }
              }else{
               
                var ligCel_1 = parseInt(tab[0].substring(3, tab[0].indexOf(" ")));
                var colCel_1 = parseInt(tab[0].substring(8));
                var idCell_1 = "Lig"+(ligCel_1+2)+" Col"+(colCel_1);
                
                var ligCel_2 = parseInt(tab[1].substring(3, tab[1].indexOf(" ")));
                var colCel_2 = parseInt(tab[1].substring(8));
                var idCell_2 = "Lig"+(ligCel_2+2)+" Col"+(colCel_2);
                
                if((filsNoeud[h].getAttribute("onclick")=="selectPion(this.id)" &&  filsNoeud[h].getAttribute("fill") == "black") || (filsNoeud[h].getAttribute("onclick")=="caseSelct(this.id)")){
                  filsNoeud[h].removeAttribute("onclick");
              }
                document.getElementById(tab[0]).setAttribute("onclick","selectPion(this.id)");
                document.getElementById(tab[1]).setAttribute("onclick","selectPion(this.id)");
                document.getElementById(idCell_1).setAttribute("onclick","caseSelct(this.id)");
                document.getElementById(idCell_2).setAttribute("onclick","caseSelct(this.id)");
              } 
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
            tab[count]=id;
            console.log("blanc",tab.length);
            count++;
            console.log("id",id);
           
            for(var h=0; h<filsNoeud.length;h++){
              if(tab.length==1){
              if((filsNoeud[h].getAttribute("onclick")=="selectPion(this.id)" &&  filsNoeud[h].getAttribute("fill") == "white" && filsNoeud[h].getAttribute("id")!=id)||
              (filsNoeud[h].getAttribute("onclick")=="caseSelct(this.id)" && filsNoeud[h].getAttribute("id")!="Lig"+(i-2)+" Col"+(j+2) && filsNoeud[h].getAttribute("id")!="Lig"+(i-2)+" Col"+(j-2))){
                  filsNoeud[h].removeAttribute("onclick");
                  console.log("joueur1 if");
              }
              }else{
                var ligCel_1 = parseInt(tab[0].substring(3, tab[0].indexOf(" ")));
                var colCel_1 = parseInt(tab[0].substring(8));
                var idCell_1 = "Lig"+(ligCel_1-2)+" Col"+(colCel_1);
                
                var ligCel_2 = parseInt(tab[1].substring(3, tab[1].indexOf(" ")));
                var colCel_2 = parseInt(tab[1].substring(8));
                var idCell_2 = "Lig"+(ligCel_2-2)+" Col"+(colCel_2);

                if((filsNoeud[h].getAttribute("onclick")=="selectPion(this.id)" &&  filsNoeud[h].getAttribute("fill") == "white") || (filsNoeud[h].getAttribute("onclick")=="caseSelct(this.id)")){
                  filsNoeud[h].removeAttribute("onclick");
              }
                document.getElementById(tab[0]).setAttribute("onclick","selectPion(this.id)");
                document.getElementById(tab[1]).setAttribute("onclick","selectPion(this.id)");
                document.getElementById(idCell_1).setAttribute("onclick","caseSelct(this.id)");
                document.getElementById(idCell_2).setAttribute("onclick","caseSelct(this.id)");
                
              } 
            }

          }
        
         }
      }
    }
    
  }

  
  var miseAjour = function(couleurPion){
    var noeud = document.getElementById("grille");
    var filsNoeud = noeud.childNodes;
    var count = 0;
    for(var k =0;k<filsNoeud.length;k++){
      if(filsNoeud[k].getAttribute("fill")=="brown" && filsNoeud[k].getAttribute("onclick")){
        count++;
      }
    }
    console.log("count",count);
      if(couleurPion=="black"){
      for(var g =0;g<filsNoeud.length;g++){
        if(filsNoeud[g].getAttribute("fill")=="black"){
          filsNoeud[g].setAttribute("onclick", "selectPion(this.id)");
          
        }
        else if(count<=2){
          if(filsNoeud[g].getAttribute("fill")=="brown"){
            filsNoeud[g].setAttribute("onclick", "caseSelct(this.id)");
            
          }
        }
       }
      }
      else if (couleurPion=="white"){
        for(var g =0;g<filsNoeud.length;g++){
        if(filsNoeud[g].getAttribute("fill")=="white"){
          filsNoeud[g].setAttribute("onclick", "selectPion(this.id)");
          
        }
        
        else if(count<=2){
          if(filsNoeud[g].getAttribute("fill")=="brown"){
            filsNoeud[g].setAttribute("onclick", "caseSelct(this.id)");
            
          }
        }
       }
      }
  }

//tableau pour gérer les tour de jeu 
  var joueurs = ["joueur1"];
  
  var elemClignote;

  //varaible pour stocker le pion qui a été bouger 
  var pionbouger;
  
  //gérer 
  var gereTourJeu = function(couleurPion){

    var cordPion = pionbouger.getAttribute("transform");
    var id = pionbouger.getAttribute("id");
    var xPionBoug = parseInt(cordPion.substring(10, cordPion.indexOf(',')));
    var yPionBoug = parseInt(cordPion.substring(cordPion.indexOf(',') + 1, cordPion.length - 1));
   
    if(couleurPion =="black"){
        
      if(yPionBoug >= 400 || xPionBoug >= 400)
          return "joueur2";
        
          else if((plateau[(yPionBoug + 100)/50][(xPionBoug - 100)/50]== 0 || plateau[(yPionBoug + 100)/50][(xPionBoug + 100)/50]== 0) &&
                (plateau[(yPionBoug + 50) / 50][(xPionBoug + 50) / 50] == 2 || plateau[(yPionBoug + 50) / 50][(xPionBoug - 50) / 50] == 2)){
                  selectPion(id);
                  return "joueur1";
          }else 
                  return "joueur2"; 
    }
    
    else{
      
      if(yPionBoug <= 50 || xPionBoug <= 50 )
      
      return "joueur1";
      
      else if((plateau[(yPionBoug - 100)/50][(xPionBoug - 100)/50]== 0 || plateau[(yPionBoug - 100)/50][(xPionBoug + 100)/50]== 0) &&
            (plateau[(yPionBoug - 50) / 50][(xPionBoug + 50) / 50] == 1 || plateau[(yPionBoug - 50) / 50][(xPionBoug - 50) / 50] == 1)){
             selectPion(id);
             return "joueur2";
     } else
              return "joueur1"; 
    }
  }
  
//  pionABouger(joueurs[0]);
 
  var selectPion = function (idPion) {
    
    var elemClick = document.getElementById(idPion);
    var couleurPion = elemClick.getAttribute("fill");
   
    if((couleurPion == "black" && joueurs[0] == "joueur1") || 
    (couleurPion == "white" && joueurs[0] == "joueur2") ){
      if (elemClignote != undefined) elemClignote.removeAttribute("class");
      elemClick.setAttribute("class", "pionActif");
      elemClignote = elemClick;
    }
  }


  var caseSelct = function (idCell) {
    //case séléction (ligne, colonne)
    var ligne = parseInt(idCell.substring(3, idCell.indexOf(" ")));
    var col = parseInt(idCell.substring(idCell.indexOf("l") + 1, idCell.length));

    //cordonnées de la case
    var cell = document.getElementById(idCell);
    var cordCell = cell.getAttribute("transform");
    var xCell = parseInt(cordCell.substring(10, cordCell.indexOf(',')));
    var yCell = parseInt(cordCell.substring(cordCell.indexOf(',') + 1, cordCell.length - 1));

    //cordonnées de la case
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
          joueurs[0]="joueur2";
          pionABouger(joueurs[0]);
          
        }
      

      else if(fill == "white" && yCell == yPion - 50 && joueurs[0]=="joueur2" && (xCell == xPion - 50 || xCell == xPion + 50)) {
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
         
        joueurs[0]=gereTourJeu("black");
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
        joueurs[0]=gereTourJeu("white");
        pionABouger(joueurs[0]);
        miseAjour("white");
       
        
        console.log(joueurs[0]);
      } 
    } 
  }