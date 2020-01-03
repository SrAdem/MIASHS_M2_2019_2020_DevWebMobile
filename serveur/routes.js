'use strict';

module.exports = function(app) {
	var user = require('../controllers/userController');

	// todoList Routes
    app.route('/inscription')
        .get(function(req, res){
            res.render('inscription.html');
        })
		.post(user.register);
};
