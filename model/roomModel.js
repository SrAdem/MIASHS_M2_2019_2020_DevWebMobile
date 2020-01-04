'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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


class Game {
    constructor(room, player) {
        this.room = room;
        this.firstPlayer = player;
    }

    setfirstPlayer(player) {
        this.firstPlayer = player;
    }

    setSecondPlayer(player) {
        this.secondPlayer = player;
    }
}

module.exports = Game;
