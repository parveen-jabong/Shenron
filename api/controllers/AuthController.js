'use strict';

var BaseController = require('./BaseController');

var AuthController = BaseController.extend({
    'add': function (req, res) {
        var requestBody = req.body;
        AuthService.add(requestBody.name, requestBody.email, requestBody.password, requestBody.username, function(err, user){
            var responseObject = {
                status : 'false',
                message : ''
            };

            if (err){
                responseObject.message = err ? err.message : "User Not Added";
            } else {
                responseObject.message = 'OK';
                responseObject.status = true;
            }
            res.json(responseObject);
        });
    },
    'login' : function(req, res){
        console.log("ssss");
        var responseObject = {
            status : 'false',
            message : ''
        };
        var requestBody = req.body;
        console.log(requestBody);
        AuthService.findByEmail(requestBody.email, function(err, user){
            console.log(err, user);
            if (err || !user) {
                responseObject.message = err ? err.message : "User Doesn't Exist";
            } else {
                AuthService.verifyPassword(user, requestBody.password, function(err, user){
                    console.log('verifyPassword', err, user)
                    if (err) {
                        responseObject.message = err.message;
                    } else {
                        responseObject.message = 'OK';
                        responseObject.status = true;
                    }
                });
            }
            res.json(responseObject);
        });
    },
    getLoginPage : function(req, res){
        res.render('login');
    }
});

module.exports = AuthController;