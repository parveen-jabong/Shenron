'use strict';

var BaseController = require('./BaseController');
var IndexController = BaseController.extend({
    index: function (req, res) {
        var data = {
            baseUrlJS : '//' + sails.config.staticBaseUrl + '/live/js',
            baseUrlCSS : '//' + sails.config.staticBaseUrl + '/live/css'
        };
        if (!isEmpty(req.staticPage)) {
            var pageHtml = req.staticPage.text,
            html = $.parseHTML("<div class='staticPageEditableCMS'>" + pageHtml + "</div>");
            $('body').empty().append(html);
            if (html){
                $("[data-cms-editable=true]").wrap("<div class='editableCMSDiv'><button class='editableCMSButton'>Edit</button></div>");
            } else {
                res.notFound();
            }
            data.pageHtml = $('body').html();
            data.endBlock = req.staticPage.body_end_block;
        } else {
            return res.notFound();
        }
        res.render('cms/index', data);
    }
});

module.exports = IndexController;
