const log = require("../startup/logging");
function errorHandler(err, req, res, next) {
    log.error(err.stack);
    res.status(err.status || 500).json({
        success: false, 
        error:{
            message: err.message || 'Internal Server Error'
        }
    });
}

module.exports = errorHandler;