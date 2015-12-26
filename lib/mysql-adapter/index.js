'use strict';

var mysql = require('mysql');
var connection;

function getConnection(host, port, user, password, database){
    if (!connection) {
        connection = mysql.createConnection({
            host: host || 'localhost',
            port: port || '3306',
            user: user || 'root',
            password: password || '',
            database: database || ''
        });
    }
    return connection;
}


module.exports = {
    connect : getConnection
    /*
    //@TODO Functions to find upate create and findone queries
    // No Time For it now.
    findOne : function(){
        if (connection){
            connection.query(query, function(err, results){
                if (err) {
                    console.log(err);
                } else {
                    console.log(results);
                }
            });
        }
    },
    find : function(){
        if (connection){
            connection.query(query, function(err, results){

            });
        }
    },
    update : function(){
        if (connection){
            connection.query(query, function(err, results){

            });
        }
    },
    create : function(){
        if (connection){
            connection.query(query, function(err, results){

            });
        }
    }*/
};