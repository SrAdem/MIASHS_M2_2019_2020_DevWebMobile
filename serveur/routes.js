'use strict';

module.exports = function(app) {
	var user = require('../controllers/userController');

	// todoList Routes
    app.route('/inscription')
		.post(user.register);
    
    app.route('/jeuDame')
        .post(user.sign_in)
        .get(user.jeuDame);

    app.route('')
    //Connexion
    app.route("/")
        .get(function(req, res){
            if(req.session.userId){
                res.redirect('/jeuDame');
            }else{
                res.render('accueil.html');
            }
        });
   
    //Déconnexion
    app.route("/deconnexion")
        .get(function(req, res){
            if(req.session.userId){
                req.session.destroy();
            }
            res.redirect("/");
        });
};
