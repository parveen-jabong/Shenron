/**
 * Created by Parveen Arora on 25/12/15.
 */

'use strict';

var BaseController = require('./BaseController');
var IndexController = BaseController.extend({
    index: function (req, res) {
        var data = {}, userToken = req.session.userToken, count = 0, cmsKey = req.cmsKey;

        if (isEmpty(req.staticPage)) {
            res.notFound();
        } else {
            data = {
                baseUrlJS : '//' + sails.config.staticBaseUrl + '/live/js',
                baseUrlCSS : '//' + sails.config.staticBaseUrl + '/live/css',
                pageHtml : req.staticPage.text,
                endBlock : req.staticPage.body_end_block
            };
        }
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
});

module.exports = IndexController;
