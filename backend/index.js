//import express
const express=require('express');

//import db connection
const db = require('./config/db');

//import cors
const cors = require('cors')

//import routes
const router = require('./router/route')

//app creation
const blogManagementServer = express();

// middleware
blogManagementServer.use(cors());
blogManagementServer.use(express.json());

blogManagementServer.use(express.static("public"));

// use routes
blogManagementServer.use(router);

blogManagementServer.use('/uploads', express.static('./uploads'))



//port Define
const PORT = 3000;

//server start
blogManagementServer.listen(PORT,()=>{
    console.log(`\nBlogManagement Server running on Port ${PORT}`);
    
})
