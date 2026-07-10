//import dotenv
require('dotenv').config();

// import mongoose
const mongoose = require("mongoose");

dbString=process.env.connectionString

//node connect to mongoDB Database
mongoose.connect(dbString).then(()=>{
    console.log("Connected to mongoDB Database\n");    
}).catch((err)=>{
    console.log("Error in Database connection " +err);
    
})