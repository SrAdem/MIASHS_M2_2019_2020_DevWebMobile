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