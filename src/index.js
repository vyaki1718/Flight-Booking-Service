const express = require('express');
const {ServerConfig, Logger } =require('./config');
const apiRoutes=require('./routes/index')

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api', apiRoutes)

app.listen(ServerConfig.PORT, function exc(){
    
    console.log(`Server successfull running on http://localhost:${ServerConfig.PORT}`)

    // Logger.info("successfully started the server", "root", {})
})