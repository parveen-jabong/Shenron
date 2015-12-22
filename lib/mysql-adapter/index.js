'use strict';

var mysql = require('mysql');
var connection;

function connect(host, user, password, database){
    if (!connection){
        connection = mysql.createConnection({
            host     : host || 'localhost',
            user     : user || 'root',
            password : password || '',
            database : database || ''
        });
        connection.connect(function(err){
            if(!err) {
                console.log("Database is connected ... nn");
            } else {
                console.log("Error connecting database ... nn");
            }
        });
    } else {

    }
}


module.exports = {
    executeQuery : function(query){
        connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
            if (err) throw err;

            console.log('The solution is: ', rows[0].solution);
        });
    }

};