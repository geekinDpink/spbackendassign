const express = require("express");
const food = require("../model/food");
const category = require("../model/category");
const user = require("../model/user");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../model/config");
const cors = require("cors");

var app = express();

app.use(express.json());
app.use(cors());

//create custom middleware with express
function verifyToken(req,res,next){
    //authorization of header property, contain bearer token, which contain Bearer keyword
    var token = req.headers.authorization;

    //if token doesn't exist or token doesn' have Bearer keyword
    if(!token || !token.includes("Bearer ")){
        res.status(403).send({"message":"authorisation token not found"});
    }
    else{
        //if token exist, e.g. of bearer token value is Bearer mvfkmkmbkgm.fkmkfm.vffvffd
        //keep the string token and store it into token bearer
        token = token.split("Bearer ")[1];
        //verify if token is valid. decoded in callback fn is payload
        jwt.verify(token, jwtKey, (err,decoded)=>{
            //if error exist fireback err statement
            if(err){
                res.status(500).send(err);
            }
            else{

                //store payload so that can retrieve req.auth.role/user_name
                req.auth = decoded;
                //console.log("verifyToken, req.auth:"+req.auth);
                next();
            }
        });
    }
}

//login to return encrypted token containing username and role in payload of token
app.post("/login",(req,res)=>{
    
    var username = req.body.user_name;
    var password = req.body.password;

    user.login(username,password,(err,token)=>{
        if(err){
            res.status(500).send({"message":"login fail"});
        }
        else{
            res.status(200).send(token);
        }
    });
});

app.post("/add_food", verifyToken, (req, res) => {

    var foodname = req.body.foodname;
    var description = req.body.description;
    var price = req.body.price;
    var stall = req.body.stall;
    var image = req.body.image;
    var category = req.body.category;    

    if(req.auth.role =="Admin"){
        food.addFoodItemAutoTimeStamp(foodname,description,price,stall,image,category,(err, result1) => {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result1);
            }
        });
    }
    else{
        res.status(500).send({"message":"insufficient user privilege"});
        //console.log("add_food API req.auth.role:"+req.auth.role);
    }
});


app.post("/add_category", verifyToken, (req, res) => {

    var name = req.body.name;
    var description = req.body.description;

    if(req.auth.role =="Admin"){
        category.addCategory(name,description,(err, result) => {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        });
    }
    else{
        res.status(500).send({"message":"insufficient user privilege"});
        //console.log("add_food API req.auth.role:"+req.auth.role);
    }
});

app.put("/update_food_By_Name", verifyToken, (req, res) => {

    var foodname = req.body.foodname;
    var description = req.body.description;
    var price = req.body.price;
    var stall = req.body.stall;
    var image = req.body.image;
    var category = req.body.category;

    if(req.auth.role =="Admin"){
        food.updateFoodByName(foodname,description,price,stall,image,category,(err, result) => {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        });
    }
    else{
        res.status(500).send({"message":"insufficient user privilege"});
        //console.log("add_food API req.auth.role:"+req.auth.role);
    }
});

app.put("/update_food_By_Id", verifyToken, (req, res) => {

    var foodId = req.body.foodId
    var foodname = req.body.foodname;
    var description = req.body.description;
    var price = req.body.price;
    var stall = req.body.stall;
    var image = req.body.image;
    var category = req.body.category;

    if(req.auth.role =="Admin"){
        food.updateFoodById(foodId,foodname,description,price,stall,image,category,(err, result) => {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        });
    }
    else{
        res.status(500).send({"message":"insufficient user privilege"});
        //console.log("add_food API req.auth.role:"+req.auth.role);
    }
});


app.put("/update_category", verifyToken, (req, res) => {

    var name = req.body.name;
    var description = req.body.description;

    if(req.auth.role =="Admin"){
        category.updateCategory(name,description,(err, result) => {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        });
    }
    else{
        res.status(500).send({"message":"insufficient user privilege"});
        //console.log("add_food API req.auth.role:"+req.auth.role);
    }
});

app.delete("/delete_category", verifyToken, (req, res) => {

    var name = req.body.name;

    if(req.auth.role =="Admin"){
        category.deleteCategory(name,(err, result) => {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        });
    }
    else{
        res.status(500).send({"message":"insufficient user privilege"});
        //console.log("add_food API req.auth.role:"+req.auth.role);
    }
});

app.delete("/delete_food", verifyToken, (req, res) => {

    var name = req.body.name;

    if(req.auth.role =="Admin"){
        food.deleteFood(name,(err, result) => {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        });
    }
    else{
        res.status(500).send({"message":"insufficient user privilege"});
        //console.log("add_food API req.auth.role:"+req.auth.role);
    }
});


//***********************Public ****************************************

app.get("/food", (req, res) => {
    food.getAllFood((err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(result);
        }
    });
});


app.get("/food/:stallname", (req, res) => {
    food.getFoodByStallName(req.params.stallname, (err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(result);
        }
    });
});


app.get("/category", (req, res) => {
    category.getAllCategory((err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(result);
        }
    });
});



app.post("/food/price", (req, res) => {

    var minPrice = req.body.minPrice;
    var maxPrice = req.body.maxPrice;

    food.getFoodWithinPriceRange(minPrice,maxPrice,(err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(result);
        }
    });
});





//3 Services/Web API for Admin
/* 
app.post("/getUserCredential", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;

    user.authenticate(email,password,(err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(result);
        }
    });
});
*/


/*
app.put("/getUserCredential/add_food", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    var foodname = req.body.foodname;
    var description = req.body.description;
    var price = req.body.price;
    var stall = req.body.stall;
    var image = req.body.image;
    var category = req.body.category;
    var date = req.body.date;

    user.authenticate(email,password,(err, result) => {
        //return err for authenticate
        if (err) {
            res.status(400).send(err);
        }
        //does not return err for authenticate, i.e. receive null/admin/role
        else {
            //email or password is wrong, i.e. does not match any record that in database
            if(!result[0]){
                res.status(400).send({"message":"wrong email and/or password"});
            }
            else{
                if(result[0].ROLE == "Admin"){
                    food.addFoodItem(foodname,description,price,stall,image,category,date,(err, result1) => {
                        if (err) {
                            res.status(400).send(err);
                        }
                        else {
                            res.status(200).send(result1);
                        }
                    });
                }
                else{
                    res.status(400).send({"message":"User Access not authorised.","user role":result[0].ROLE});
                }
            }
        }
    });
});

app.put("/getUserCredential/add_food_autoTimeStamp", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    var foodname = req.body.foodname;
    var description = req.body.description;
    var price = req.body.price;
    var stall = req.body.stall;
    var image = req.body.image;
    var category = req.body.category;
    

    user.authenticate(email,password,(err, result) => {
        //return err for authenticate
        if (err) {
            res.status(400).send(err);
        }
        //does not return err for authenticate, i.e. receive null/admin/role
        else {
            //email or password is wrong, i.e. does not match any record that in database
            if(!result[0]){
                res.status(400).send({"message":"wrong email and/or password"});
            }
            else{
                if(result[0].ROLE == "Admin"){
                    food.addFoodItemAutoTimeStamp(foodname,description,price,stall,image,category,(err, result1) => {
                        if (err) {
                            res.status(400).send(err);
                        }
                        else {
                            res.status(200).send(result1);
                        }
                    });
                }
                else{
                    res.status(400).send({"message":"User Access not authorised.","user role":result[0].ROLE});
                }
            }
        }
    });
});
*/

/*
app.put("/getUserCredential/add_category", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var description = req.body.description;

    user.authenticate(email,password,(err, result) => {
        //return err for authenticate
        if (err) {
            res.status(400).send(err);
        }
        //does not return err for authenticate, i.e. receive null/admin/role
        else {
            //email or password is wrong, i.e. does not match any record that in database
            if(!result[0]){
                res.status(400).send({"message":"wrong username and/or password"});
            }
            else{
                if(result[0].ROLE == "Admin"){
                    category.addCategory(name,description,(err, result) => {
                        if (err) {
                            res.status(400).send(err);
                        }
                        else {
                            res.status(200).send(result);
                        }
                    });
                }
                else{
                    res.status(400).send({"message":"User Access not authorised.","user role":result[0].ROLE});
                }
            }
        }
    });
});
*/

/* Adding Food/Category without authentication
app.put("/add_food", (req, res) => {

    var foodname = req.body.foodname;
    var description = req.body.description;
    var price = req.body.price;
    var stall = req.body.stall;
    var image = req.body.image;
    var category = req.body.category;
    var date = req.body.date;

    
    food.addFoodItem(foodname,description,price,stall,image,category,date,(err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(result);
        }
    });
});

app.put("/add_category", (req, res) => {

    var name = req.body.name;
    var description = req.body.description;
    
    category.addCategory(name,description,(err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send(result);
        }
    });
});
*/

module.exports = app;