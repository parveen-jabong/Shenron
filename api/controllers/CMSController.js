/**
 * Created by Parveen Arora on 26/12/15.
 * This Service is specific to Bob database.
 * It is used to push html and url in the tables.
 */

'use strict';

var BaseController = require('./BaseController');
var CMSController = BaseController.extend({
    save: function (req, res) {
        var requestBody = req.body;
        CMSService.update(requestBody.cmsKey, requestBody.content, function(err, update){
            if (err) {
                sails.log.error('Not able to update CMS of MongoDB', err);
            }
        });
        ImageConfigurationService.getByAttributeIdAndCMSKey(requestBody.attributeId, requestBody.cmsKey, function(err, imageConfig, imageList) {
            if (err) {
                sails.log.error('ImageConfigurationService->index Error while getting imageconfig by attributeid and cmskey', err);
            } else {
                if (!imageConfig) {
                    ImageConfigurationService.add(requestBody.url, requestBody.ici, requestBody.icn, requestBody.attributeId, requestBody.cmsKey, null, function(err, imagconfig){
                        if (err) {
                            sails.log.error('CMSController->save Error while adding imageconfig', err);
                        }
                    });
                } else {
                    ImageConfigurationService.update(imageConfig, requestBody.url, requestBody.ici, requestBody.icn, null, function(err, imageConfig){
                        if (err) {
                            sails.log.error('CMSController->save Error while updating imageconfig by attributeid and cmskey', err);
                        }
                    });
                }
            }
        });
        // This is related to BOB Database use judiciously. #IMP
         CMSDatabaseService.updateCMSDatabase(requestBody.key, requestBody.content, function(err, success){
             if (err) {
                 sails.log.error('Not able to update CMSDatabase(BOB)', err);
                 res.json({
                     success : false,
                     message : [err.message]
                });
             } else {
                res.json({
                    success : true,
                    message : ['CMS Updated']
                });
             }
         });
    }
});

module.exports = CMSController;