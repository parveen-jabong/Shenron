'use strict';

var BaseController = require('./BaseController');

var IndexController = BaseController.extend({
    index: function (req, res) {
        var data = {};
        if (!isEmpty(req.staticPage)) {
            data.pageHtml = req.staticPage.text;
            data.endBlock = req.staticPage.body_end_block;
        } else {
            return res.notFound();
        }
        if (req.xhr) {
            return res.ok(data, {
                view: 'cms/index',
                sendHTML: true
            });
        } else {
            res.ok(data, 'cms/index');
        }
    }
});

module.exports = IndexController;
