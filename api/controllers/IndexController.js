'use strict';

var BaseController = require('./BaseController');

var IndexController = BaseController.extend({
    index: function (req, res) {
        var data = {
            baseUrlJS : '//' + sails.config.staticBaseUrl + '/live/js',
            baseUrlCSS : '//' + sails.config.staticBaseUrl + '/live/css'
        };
        if (!isEmpty(req.staticPage)) {
            data.pageHtml = req.staticPage.text;
            data.endBlock = req.staticPage.body_end_block;
        } else {
            return res.notFound();
        }
        res.render('cms/index', data);
    }
});

module.exports = IndexController;
