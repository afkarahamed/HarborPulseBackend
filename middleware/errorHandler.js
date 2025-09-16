const winston = require("winston");
function errorHandler(err, req, res, next) {
    winston.error(err.stack);
    res.status(err.status || 500).json({
        success: false, 
        error:{
            message: err.message || 'Internal Server Error'
        }
    });
}

module.exports = errorHandler;