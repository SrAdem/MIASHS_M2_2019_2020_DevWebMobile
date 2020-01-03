let mongoose = require('mongoose');

const serve = "127.0.0.1:27017";
const database = "dame-db";

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect('mongodb://'+serve+''+database, 
            {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
        .then(() => {
            console.log('la connexion à la bdd réussi.');
        })
        .catch(err => {
            console.error('la connexion à échoué ');
        })
    }
}

module.exports = new Database();