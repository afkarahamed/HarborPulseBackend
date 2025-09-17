const {pool} = require("../database/db");
const bcrypt = require("bcryptjs");

const config = require("config");
const jwt = require("jsonwebtoken");

const jwtSecret = config.get("jwt.secret");
const jwtExpiresIn = config.get("jwt.expiresIn");


exports.registerUser = async(req, res) =>{
    const {username, password} = req.body;

    if(!username || !password){
        const err = new Error("Username and Password are required");
        err.status = 400;
        throw err;
    }

    const [existing] = await pool.query(`
        SELECT user_id 
        FROM users 
        WHERE username= ?;
        `, [username]);

    if(existing.length){
        const err = new Error("Username already exists");
        err.status = 400;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(`
        INSERT INTO users
        (username, password, role)
        VALUES (?,?,"user");
        `, [username, hashedPassword]);
    
    const insertedId = result.insertId;

    if(!insertedId){
        const err = new Error("Registration failed");
        err.status = 500;
        throw err;
    }

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        userId: insertedId
    });
}

exports.loginUser = async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password){
        const err = new Error ("Invalid Credentials");
        err.status = 400;
        throw err;
    }

    const [rows] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    if (!rows.length) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    const token = jwt.sign(
        {userId: user.userId, role: user.role },
        jwtSecret,
        {expiresIn: jwtExpiresIn}
    );

    res.json({
        success: true,
        token,
        user: {
            user_id: user.user_id,
            username: user.username,
            role: user.role
        }
    });
}