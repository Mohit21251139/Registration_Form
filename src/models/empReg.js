const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const empSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique: true,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
    },
    cpassword:{
        type:String,
        required:true,
    },
    tokens :[{
        token:{
            type:String,
            required:true,

        }
    }]
});

//GENERATING TOKENS 
empSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;

    }catch(error){
        res.send("the error occur in token generation " + error);
        console.log("the error occur in token generation " + error);


    }
}
 

//CONVERTING PASSWORD INTO HASH 
empSchema.pre("save", async function (next) {
   
    if (this.isModified("password")){
        
        this.password = await bcrypt.hash(this.password,10 );
        

        this.cpassword = await bcrypt.hash(this.password,10 );

    }
   next();
})

//WE ARE CREATING A NEW COLLECTION 
const empCollection = new mongoose.model("empCollection",empSchema);

module.exports = empCollection;