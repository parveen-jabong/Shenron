/**
 * Created by Parveen Arora on 26/12/15.
 * This Service is specific to Bob database.
 * It is used to push html and url in the tables.
 */

'use strict';

var BaseController = require('./BaseController');
var CMSController = BaseController.extend({
    save: function (req, res) {
        console.log("in save");
        var requestBody = req.body;
        CMSService.update(requestBody.key, requestBody.content, function(err, update){
            if (err) {
                sails.log.error('Not able to update CMS of MongoDB', err);
            }
            console.log('eerr',err,update);
        });
        // This is related to BOB Database use judiciously. #IMP
        /*CMSDatabaseService.updateCMSDatabase(requestBody.key, requestBody.content, function(err, success){
            if (err) {
                sails.log.error('Not able to update CMSDatabase(BOB)', err);
            }
        });*/
    }
});

module.exports = CMSController;