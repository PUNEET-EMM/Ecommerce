const { default: mongoose } = require("mongoose");
const dotenv = require('dotenv').config();
const dbConnect = ()=>{
    try{
      const conn = mongoose.connect(process.env.MONGODB_URL);
      console.log("connection succesful");
    } 
    catch(err){
      console.log("Database error")
    }
    
}

dbConnect();
module.exports=dbConnect;