# MIASHS_M2_2019_2020_DevWebMobile

Projet de dame dans le cadre d'étude du Master MIASHS WIC et DCISS en deuxième année.

### Prérequis
 - Python 2.7 ou 3.X
 - Anaconda ou Miniconda
 - Nodejs, MongoDB, Gradle, les SDK android et Java ainsi que Cordova installé

## Installation

 - Cloner le projet ou désarchiver le zip
 ``` https://github.com/SrAdem/MIASHS_M2_2019_2020_DevWebMobile.git ```
 - Entrer dans le répertoire
 ``` cd MIASHS_M2_2019_2020_DevWebMobile ```
 - Se placer dans la branch dev si vous utilisez le repository git.
 ``` git checkout dev ```
 - Installer les dépendances dans le dossier ./Client et ./serveur
 ``` cd Client // cd serveur ```
 ``` npm install ```
 - Ajouter les plateformes sur le client
 ``` cd Client ```
 ``` cordova platform add browser ```
 ``` cordova platform add android ```
 

# Lancer la base de données
 - Si besoin : Entrer dans votre environnement (via conda / miniconda) 
 ``` conda activate monEnv ```
 - Lancer Mongo (dans l'environnement) ou alors créer un dossier data/db
 ``` cd MIASHS_M2_2019_2020_DevWebMobile ```
 ``` mkdir -r data/db ```
 ``` mongod --dbpath PATH/env/monEnv  // mongod --dbpath data/db```

# Lancer le serveur
 - Lancer le serveur
 ``` node serveur/serveur.js ```

# Lancer l'application
 - Récupérer votre adresse ip 
 ``` ipconfig ```
 - Modifier les adresses aux lignes 47 et 59 "http://......" de index.html en mettant votre adresse à la place. Attention à ne pas supprimer le port !! 
 ``` http://VOTRE_ADRESS:12345/quelquechose ```
## Pour navigateur
 - Lancer cordova
 ``` cordova run browser ```

## Pour android
- Brancher votre mobile
- Connecter le télépone au mếme point d'acces internet (Le mieux est d'utiliser le téléphone comme hotspot wifi)
- Même processus que dans la partie "Lancer application", l'adresse ip à probablement changer.
- Lancer cordova 
 ``` cordova run android ```