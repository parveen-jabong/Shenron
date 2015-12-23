'use strict';

var mysql = require('mysql');
var connection;

function getConnection(host, user, password, database, cb){
    if (!connection){
        connection = mysql.createConnection({
            host     : host || 'localhost',
            user     : user || 'root',
            password : password || '',
            database : database || ''
        });
        connection.connect(function(err){
            if(!err) {
                cb(null, connection);
            } else {
                cb(new Error("Error connecting database"), null);
            }
        });
    } else {
        cb(null, connection);
    }
}


module.exports = {
    connect : getConnection
};