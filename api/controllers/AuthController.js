'use strict';

var BaseController = require('./BaseController');
function Response() {
    this.success = 'false';
    this.message = [];
};

var AuthController = BaseController.extend({
    add: function (req, res) {
        var requestBody = req.body;
        AuthService.add(requestBody.name, requestBody.email, requestBody.password, requestBody.username, function(err, user){
            var responseObject = new Response();
            if (err){
                var msg = err ? err.message : "User Not Added";
                responseObject.message.push(msg);
            } else {
                responseObject.message.push('OK');
                responseObject.success = true;
            }
            res.json(responseObject);
        });
    },
    login : function(req, res) {
        var requestBody = req.body;
        AuthService.findByEmail(requestBody.email, function(err, user){
            var responseObject = new Response();
            if (err || !user) {
                responseObject.message = err ? err.message : "User Doesn't Exist";
            } else {
                AuthService.verifyPassword(user, requestBody.password, function(err, user){
                    if (err) {
                        responseObject.message.push(err.message);
                    } else {
                        responseObject.message.push('OK');
                        responseObject.success = true;
                        req.session.authenticated = true;
                    }
                });
            }
            res.json(responseObject);
        });
    },
    getLoginPage : function(req, res){
        res.render('login');
    },
    logout : function(req, res){
        req.session = null;
        delete req.session;
    }
});

module.exports = AuthController;