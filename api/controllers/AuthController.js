'use strict';

var BaseController = require('./BaseController');

var AuthController = BaseController.extend({
    'add': function (req, res) {
        var requestBody = req.body;
        AuthService.add(requestBody.name, requestBody.email, requestBody.password, requestBody.username);
    },
    'login' : function(req, res){
        var responseObject = {
            status : 'false',
            message : ''
        }
        AuthService.findByUsername(username, function(err, user){
            if (err) {
                responseObject.message = err.message;
            } else {
                AuthService.verifyPassword(user, password, function(err, user){
                    if (err) {
                        responseObject.message = err.message;
                    } else {
                        responseObject.message = 'OK';
                        responseObject.status = true;
                    }
                });
            }
        })
        res.json(responseObject);
    }
});

module.exports = AuthController;