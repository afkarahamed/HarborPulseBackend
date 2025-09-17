const {pool} = require("../config/db");


exports.getUsers = async (req, res) =>{
    const [rows] = pool.query("SELECT user_id, username, role FROM users");

    if(!rows.length){
        const err = new Error("No users found");
        err.status = 404;
        throw err;
    }

    res.json({
        success: true, 
        data: rows
    })
}