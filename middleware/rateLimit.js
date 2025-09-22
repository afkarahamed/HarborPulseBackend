const rateLimit = require('express-rate-limit');


exports.registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, 
    message: { success: false, error: 'Too many registration attempts. Try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

exports.forgotPasswordLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3, 
    message: { success: false, error: 'Too many registration attempts. Try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});