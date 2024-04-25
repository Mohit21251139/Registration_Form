const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/EmployeeRegistration")
.then(() =>{
    console.log("Connection successsful");
}).catch((e) =>{
    console.log("No connection");
});