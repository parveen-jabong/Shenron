/**
 * Compiles LESS files into CSS.
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 * https://github.com/gruntjs/grunt-contrib-less
 */
module.exports = function(grunt) {

    grunt.config.set('less', {
        dev: {
            files: {
                '.tmp/public/styles/main/bootstrap.css': 'assets/styles/bootstrap/less/bootstrap.less',
                '.tmp/public/styles/pdp.css': 'assets/styles/bootstrap/jabong/pdp/import.less',
                '.tmp/public/styles/cart.css': ['assets/styles/bootstrap/jabong/cart/cart.less', 'assets/styles/bootstrap/jabong/pdp/size-help.less'],
                '.tmp/public/styles/save-for-later.css': ['assets/styles/bootstrap/jabong/cart/save-for-later.less', 'assets/styles/bootstrap/jabong/pdp/size-help.less'],
                '.tmp/public/styles/catalog.css': ['assets/styles/bootstrap/jabong/catalog/import.less'],
                '.tmp/public/styles/home.css': 'assets/styles/bootstrap/jabong/home/home.less',
                '.tmp/public/styles/segment.css': 'assets/styles/bootstrap/jabong/segment/segment.less',
                '.tmp/public/styles/thankyou.css': 'assets/styles/bootstrap/jabong/thankyou/thankyou.less',
                '.tmp/public/styles/checkout.css': 'assets/styles/bootstrap/jabong/checkout/checkout.less',
                '.tmp/public/styles/account.css': 'assets/styles/bootstrap/jabong/account/import.less',
                '.tmp/public/styles/cms.css': 'assets/styles/bootstrap/jabong/cms/import.less',
                '.tmp/public/styles/{flow}.css': 'assets/styles/bootstrap/jabong/components/flow.less',
                '.tmp/public/styles/ie.css': 'assets/styles/bootstrap/jabong/ie-legacy/import.less',
                '.tmp/public/styles/miscellaneous.css': 'assets/styles/bootstrap/jabong/miscellaneous/miscellaneous.less',
                '.tmp/public/styles/editable-cms.css': 'assets/styles/editable-cms.less',
                '.tmp/public/styles/main/layout.css' : 'assets/styles/layout.less'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
};
