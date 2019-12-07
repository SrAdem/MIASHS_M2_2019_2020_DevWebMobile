const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('<h1>Collectif métissé -- Projet Jeu de dames</h1>');
});

app.listen(3000, function () {
  console.log('Server listening on port 3000!')
});
