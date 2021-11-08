const db = require("./databaseconfig");

var foodDB = {};


function getTimestamp(){
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

// combine current date & time to YYYY-MM-DD HH:MM:SS format
const nowTimeStamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    return nowTimeStamp;
}



foodDB.getAllFood = function(callback){
    var conn = db.getConnection();

    var sqlStmt = "SELECT * FROM food";

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

foodDB.getFoodWithinPriceRange = function(minPrice, maxPrice, callback){
    var conn = db.getConnection();

    var sqlStmt = "SELECT * FROM food WHERE PRICE BETWEEN ? AND ? ORDER BY PRICE ASC";

    conn.query(sqlStmt,[minPrice,maxPrice],(err,result)=>{
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


foodDB.getFoodByStallName = function(stallOrCat,callback){
    var conn = db.getConnection();

    var sqlStmt = "SELECT * FROM food WHERE STALL_NAME LIKE ? OR CATEGORYID LIKE ? ORDER BY PRICE ASC";

    conn.query(sqlStmt,["%"+stallOrCat+"%","%"+stallOrCat+"%"],(err,result)=>{
        conn.end();

        //if got error, return err back to controller/callback
        if(err){
            console.log("Query Error")
            return callback(err,null);
        }
        else{
            return callback(null,result);
        }
     });
};

foodDB.addFoodItem = function(foodname,description,price,stall,image,category,date,callback){
    var conn = db.getConnection();

     var sqlStmt = "INSERT INTO food (NAME,DESCRIPTION,PRICE,STALL_NAME,IMAGE_URL,CATEGORYID,DATEINSERTED) VALUE (?,?,?,?,?,?,?)";

     console.log("Data to be logged-"+"foodname:"+foodname+", descripton:"+description+", price:"+price+", stallname:"+stall+
     ",imageurl:"+image+", categoryID:"+category+", date of insertion"+date);

    conn.query(sqlStmt,[foodname,description,price,stall,image,category,date],(err,result)=>{
        conn.end();

        //if got error in SQL transaction, return err back to controller/callback
        if(err){
            console.log("Unable to add "+ foodname);
            return callback(err,null);
        }
        else{
            console.log(foodname+ " is added");
            return callback(null,result);
        }
     });
};


foodDB.addFoodItemAutoTimeStamp = function(foodname,description,price,stall,image,category,callback){
    var conn = db.getConnection();

    var dateTime = getTimestamp();

     var sqlStmt = "INSERT INTO food (NAME,DESCRIPTION,PRICE,STALL_NAME,IMAGE_URL,CATEGORYID,DATEINSERTED) VALUE (?,?,?,?,?,?,?)";

     console.log("Data to be logged-"+"foodname:"+foodname+", descripton:"+description+", price:"+price+", stallname:"+stall+
     ",imageurl:"+image+", categoryID:"+category+", date of insertion"+dateTime);

    conn.query(sqlStmt,[foodname,description,price,stall,image,category,dateTime],(err,result)=>{
        conn.end();

        //if got error in SQL transaction, return err back to controller/callback
        if(err){
            console.log("Unable to add "+ foodname);
            return callback(err,null);
        }
        else{
            console.log(foodname+ " is added");
            return callback(null,result);
        }
     });
};

foodDB.updateFoodByName = function(foodname,description,price,stall,image,category, callback){
    var conn = db.getConnection();

    var dateTime = getTimestamp();

    var sqlStmt = "UPDATE food SET DESCRIPTION = ?, PRICE = ?, STALL_NAME = ?, IMAGE_URL = ?, CATEGORYID = ?, DATEINSERTED = ? WHERE NAME = ?;";    

    conn.query(sqlStmt,[description,price,stall,image,category,dateTime,foodname],(err,result)=>{
       conn.end();

       //if got error, return err back to controller/callback
       if(err){
            console.log("Unable to update "+ foodname);
            return callback(err,null);
       }
       else if(result.affectedRows==0){
            console.log(foodname+" does not exist");
            return callback(err,null);
       }

       else{
            console.log(foodname+ " is updated");
            return callback(null,result);
       }
    });
}

foodDB.updateFoodById = function(foodId,foodname,description,price,stall,image,category, callback){
    var conn = db.getConnection();

    var dateTime = getTimestamp();

    var sqlStmt = "UPDATE food SET NAME =?, DESCRIPTION = ?, PRICE = ?, STALL_NAME = ?, IMAGE_URL = ?, CATEGORYID = ?, DATEINSERTED = ? WHERE FOODID = ?;";    

    conn.query(sqlStmt,[foodname,description,price,stall,image,category,dateTime,foodId],(err,result)=>{
       conn.end();

       //if got error, return err back to controller/callback
       if(err){
            console.log("Unable to update "+ foodname);
            return callback(err,null);
       }
       else if(result.affectedRows==0){
            console.log(foodname+" with the following "+foodId+" does not exist");
            return callback(err,null);
       }

       else{
            console.log(foodname+" with the following "+foodId+ " is updated");
            return callback(null,result);
       }
    });
}

foodDB.deleteFood = function(foodname, callback){
    var conn = db.getConnection();

    var sqlStmt = "DELETE FROM food WHERE NAME = ?;";    

    conn.query(sqlStmt,[foodname],(err,result)=>{
       conn.end();

       //if got error, return err back to controller/callback
       if(err){
            console.log("Unable to delete "+ foodname);
            return callback(err,null);
       }
       else if(result.affectedRows==0){
            console.log(foodname+" does not exist");
            return callback(err,null);
       }

       else{
            console.log(foodname+ " is deleted");
            return callback(null,result);
       }
    });
}


module.exports = foodDB;
