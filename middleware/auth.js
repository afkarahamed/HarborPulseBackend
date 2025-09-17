const jwt = require("jsonwebtoken");
const config = require("config");

const jwtSecret = config.get("jwt.secret");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization; //req.headers['authorization']
    if(!authHeader){
        res.status(401).json({error: "No token provided"});
        return;
    }

    const token = authHeader.split(" ")[1]; //getting the token
    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.user = decoded;
        next();
    }catch(err){
        if(err.name === "TokenExpiredError"){
            return res.status(401).json({
                error: "Token Expired"
            });
        }
        return res.status(403).json({
            error: "Invalid Token"
        });
    }

}