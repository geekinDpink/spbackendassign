const mysql = require("mysql");


var dbConnection = {};

dbConnection.getConnection = function(){
    var conn = mysql.createConnection({
        host:"spfoodcourt.cn1kfe7j0osb.us-east-1.rds.amazonaws.com",
        user:"admin",
        password:"guipaiqigong",
        database:"sp_food_court"
    });

    return conn;
};

module.exports = dbConnection;

