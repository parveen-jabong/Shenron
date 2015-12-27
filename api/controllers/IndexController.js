/**
 * Created by Parveen Arora on 25/12/15.
 */

'use strict';

var BaseController = require('./BaseController');
var CONST_CMS_ONLINE_SALE = 'newdesign_online-sale';

var IndexController = BaseController.extend({
    index: function (req, res) {
        var data = {}, userToken = req.session.userToken, count = 0, cmsKey = req.cmsKey;
        if (isEmpty(req.staticPage)) {
            console.log('Hello Trying');
            req.flash('error', 'Sorry, We are not able to find this key!!');
            res.redirect('/cms/key');
        } else {
            data = {
                baseUrlJS : '//' + sails.config.staticBaseUrl + '/live/js',
                baseUrlCSS : '//' + sails.config.staticBaseUrl + '/live/css',
                pageHtml : req.staticPage.text,
                endBlock : req.staticPage.body_end_block,
                count : count
            };
            UniqueIdentifierService.getByCmsKey(cmsKey, function(err, identifier){
                if (!err && identifier){
                    count = identifier.getEditCount();
                } else {
                    CMSService.add(cmsKey, data.pageHtml, function(err, cms){
                        if (err || !cms){
                            sails.log.error('Error while adding CMS', err);
                        } else {
                            UniqueIdentifierService.add(cms, userToken, function(err, identifier){
                                if (err){
                                    sails.log.error('Error while adding Unique Identifier', err);
                                }
                            });
                        }
                    });
                }
                data.count = count;

                res.view('cms/index', data);
            });
        }
    },
    getCMSKeyView : function(req, res){
        var errorMessage = res.locals.flash();
        res.view('input-staticpage-key', { error : !isEmpty(errorMessage)? errorMessage.error && _.isArray(errorMessage.error) ? errorMessage.error[0] : '' : ''});
    }
});

module.exports = IndexController;
