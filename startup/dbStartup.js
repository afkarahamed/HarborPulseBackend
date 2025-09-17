const {pool, checkConnection} = require("../database/db");
const log = require("../startup/logging");

module.exports = (async ()=>{
    try{
        const isConnected = await checkConnection();
        if(!isConnected)
            throw new Error("Database Connection Failed");

        log.info("Database Connected");
    }catch(err){
        log.error("DATABASE ERROR: ", err.message);
        process.exit(1);
    }
});