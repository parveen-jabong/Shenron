/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var Store = require('../lib/store'),
    mySQLAdapter = require('../lib/mysql-adapter');

module.exports.bootstrap = function(cb) {
    sails.SessionStorage = new Store;
    var env = require('jsdom').env
        , html = '<html><body></body></html>';

    // first argument can be html string, filename, or url
    env(html, function (errors, window) {
        if (errors) {
            sails.log.error('Failed to Jquery at Node', errors);
            return;
        }
        global.$ = require('jquery')(window);
    });
    sails.mySQLConnection = mySQLAdapter.connect(sails.config.mysql.host, sails.config.mysql.port, sails.config.mysql.user, sails.config.mysql.password, sails.config.mysql.database);
    sails.mySQLConnection.connect(function(err) {
        if (err) {
            sails.log.error('Connection with MySQL(CMS Database) Failed',  err.stack);
            return;
        }

        sails.log.info('Connection with MySQL(CMS Database) is completed');
    });
    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
