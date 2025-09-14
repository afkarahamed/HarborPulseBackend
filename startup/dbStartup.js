const {pool, checkConnection} = require("../database/db");


module.exports = (async ()=>{
    try{
        const isConnected = await checkConnection();
        if(!isConnected)
            throw new Error("Database Connection Failed");

        console.log("Database Connected");
    }catch(err){
        console.error("DATABASE ERROR: ", err.message);
        process.exit(1);
    }
});