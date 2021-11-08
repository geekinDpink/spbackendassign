const db = require("./databaseconfig");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("./config");

var userDB = {};

userDB.login = function(username,password,callback){
    var conn = db.getConnection();

    var sqlStmt = "SELECT * FROM user WHERE NAME = ? AND PASSWORD = ?";

    conn.query(sqlStmt,[username,password],(err,result)=>{
        conn.end();
        if(err){
            return callback(err,null);
        }
        else{
            //username is unique, so expected one result only            
            if(result.length ===1){
                var tokenPayLoad ={
                    user_name: result[0].Name,
                    role: result[0].Role
                };
                //console.log(result);
                //console.log(tokenPayLoad.user_name);

                var token = jwt.sign(tokenPayLoad, jwtKey, {expiresIn:"1h"});
                return callback(null,token);
            }
            else{
                return callback({"message":"login fail"},null);
            }
        }
    });
}


userDB.authenticate = function (email,password,callback){
    var conn = db.getConnection();

    var sqlStmt = "SELECT ROLE FROM user WHERE EMAIL = ? AND PASSWORD = ?";

    conn.query(sqlStmt,[email,password],(err,result)=>{
        conn.end();

        if(err){
            return callback(err,null);
        }
        else{
            return callback(null,result);
        }
    });

    return conn;

};

module.exports = userDB;
