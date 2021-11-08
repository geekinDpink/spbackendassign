const db = require("./databaseconfig");

var categoryDB = {};


categoryDB.getAllCategory = function(callback){
    var conn = db.getConnection();

    var sqlStmt = "SELECT * FROM category_table";

    conn.query(sqlStmt,[],(err,result)=>{
       conn.end();

       //if got error, return err back to controller/callback
       if(err){
           return callback(err,null);
       }
       else{
           return callback(null,result);
       }
    });
}

categoryDB.addCategory = function(name,description,callback){
    var conn = db.getConnection();

    var sqlStmt = "INSERT INTO category_table (NAME,DESCRIPTION) VALUE (?,?)";

    conn.query(sqlStmt,[name,description],(err,result)=>{
        conn.end();

        //if got error, return err back to controller/callback
        if(err){
            return callback(err,null);
        }
        else{
            return callback(null,result);
        }
     });
};

categoryDB.updateCategory = function(name,description,callback){
    var conn = db.getConnection();

    var sqlStmt = "UPDATE category_table SET DESCRIPTION = ? WHERE NAME=?";

    conn.query(sqlStmt,[description,name],(err,result)=>{
        conn.end();

        //if got error, return err back to controller/callback
        if(err){
            return callback(err,null);
        }
        else if(result.affectedRows==0){
            console.log(name+" does not exist");
            return callback(err,null);
       }
        else{
            console.log(name+"is updated");
            return callback(null,result);
        }
     });
};

categoryDB.deleteCategory = function(name,callback){
    var conn = db.getConnection();

    var sqlStmt = "DELETE FROM category_table WHERE NAME=?";

    conn.query(sqlStmt,[name],(err,result)=>{
        conn.end();

        //if got error, return err back to controller/callback
        if(err){
            return callback(err,null);
        }
        else if(result.affectedRows==0){
            console.log(name+" does not exist");
            return callback(err,null);
       }
        else{
            console.log(name+"is deleted");
            return callback(null,result);
        }
     });
};


module.exports = categoryDB;
