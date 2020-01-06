function inscriptionDiv() {
    document.getElementById("inscriptionDiv").setAttribute("style","display:block");
    document.getElementById("connexionDiv").setAttribute("style","display:none");
}

function connexionDiv() {
    document.getElementById("connexionDiv").setAttribute("style","display:block");
    document.getElementById("inscriptionDiv").setAttribute("style","display:none");
}

function loadPage(inscription) {
    if(inscription) {
        inscriptionDiv();
    }
    else {
        connexionDiv();
    }
}