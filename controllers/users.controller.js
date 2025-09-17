const {pool} = require("../database/db");


exports.getUsers = async (req, res) =>{
    const [rows] = await pool.query(`SELECT user_id, username, role FROM users`);

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

exports.postUsersRole = async(req, res) => {
    const {id} = req.params;
    const {role} = req.body;

    // if(!["user", "admin"].includes(role)){
    //     return res.status(400).json({
    //         error: "Role must be either 'user' or 'admin'"
    //     });
    // }

    const [result] = await pool.query(`
        UPDATE users 
        SET role = ? 
        WHERE user_id = ?`,
         [role, id]);
    
    if(!result.affectedRows ===0){
        const err = new Error("Update Failed");
        err.status = 400;
        throw err;
    }

    res.json({
        success: true,
        message: `User ${id} role updated to ${role}`
    });
    
}