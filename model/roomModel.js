'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Une salle est composé d'un numéro, de l'identifiant des deux joueurs et du nom du vainqueur.
 * L'enregistrement dans la base de donnée ne s'effectuera que si la partie est terminé.
 * Sinon, un tableau (array) sur le serveur gere les différents salle ou la partie est en cours.
 */
var RoomSchema = new Schema({
    room: {
        type : Number,
        trim : true,
        required : true
    },
    firstPlayer: {
        type : String,
        trim : true,
        required : true
    },
    secondPlayer: {
        type : String,
        trim : true,
        required : true
    },
    winner: {
        type : String,
        trim : true,
        required : true
    }
  });

mongoose.model('Room', RoomSchema);