// Set up MySQL connection.
var mysql = require("mysql");
var app = require('./app.js');

/*var connection = mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: "root",
    password: "",
    database: "Imperial_Assault_db"
});*/


if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
        connectionLimit: 20,
        port:3306,
        host: 'k2fqe1if4c7uowsh.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'cwyw2yiq4aykv1gh',
        password: 'ppay30spunulweu0',
        database: 'umy2v16j1tx9hhhu'
    });
};


// hard wired to database in NC21
/*
connection = mysql.createConnection({
    port:3306,
    host: 'arfo8ynm6olw6vpn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'm6fnjqsu98tbimjy',
    password: 'it7svbrrc9w1aiax',
    database: 't8dfbvzsbl4mlj42'
    //database: 'z2znazc687xl2iem'
});
*/



// Make connection.
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});
//To run Database on JAWSDB




// Export connection for our ORM to use.
module.exports = connection;