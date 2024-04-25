require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
require("./db/conn");
const empCollection = require("./models/empReg");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public");
const templates_path = path.join(__dirname,"../templates/views");
// const partials_path = path.join(__dirname,"../templates/partials");
// console.log (path.join(__dirname,"../public"));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",templates_path);
// hbs.registerPartials(partials_path);

app.use(express.urlencoded({extended:false}));


app.get("/",(req,res) =>{
    res.render("register");
});

//CREATE A NEW EMPLOYEE USER IN A DATABASE
//REGISTERaATION
app.post("/empdata",async(req,res) =>{

    try{
        const password = req.body.password;
     const cpassword = req.body.cpassword;

     if (password === cpassword){
        const empDoc = new empCollection({
            username:req.body.username,
            email: req.body.email,
            phone : req.body.phone,
            password:req.body.password,
            cpassword:req.body.cpassword
        });
       
        //HASHING FOR SAVING THE PASSWORD
        //MIDDLEWARE
        console.log ("The success message is " + empDoc);

        const token = await  empDoc.generateAuthToken();
        console.log("the token is " + token);

         const postData = await empDoc.save();
         console.log("the page part is" +postData ); 
        res.status(201).send(postData);
     }

     else {
        res.status(404).send("Password not matching....");
     }

    }catch(e){
        res.status(400).send(e);
        console.log("Error occur that is dangerious");
    }
 
});

//LOGIN CHECK

app.get("/login",(req,res) =>{
    res.render("login");
});

app.post("/loginPage", async (req,res) =>{
    try{
        const email = req.body.email;
        const loginpassword = req.body.loginpassword;
         const getEmail = await  empCollection.findOne({email:email});
        //  console.log(getEmail.password);
        //  res.send(getEmail.password);
 
        const isMatch  = await bcrypt.compare(loginpassword,getEmail.password); 

        const token = await  getEmail.generateAuthToken();
        console.log("the token is " + token);

        if (isMatch ){
            res.status(201).render("index");
        }else{
            res.status(404).send("password are not match...");
        }

    }catch(e){
        res.status(404).send("invalid login details");
    }
});

app.listen(port,() =>{
    console.log(`Server is running at port number ${port}`);
});